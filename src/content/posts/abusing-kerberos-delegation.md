---
title: "Abusing Kerberos Delegation in Active Directory"
description: "Understanding constrained and unconstrained delegation from an offensive security perspective."
date: 2026-09-10
author: "Template sample"
tags:
  - Active Directory
  - Kerberos
  - Pentesting
  - Red Team
category: "Active Directory"
draft: false
sample: true
---

:::warn
Everything in this note is written for **authorized** assessments and lab environments. Kerberos delegation issues are high-impact. Treat tickets, hashes, and service accounts as production secrets even in a lab.
:::

Active Directory still authenticates most internal Windows estates. Delegation is the feature that lets a service act on behalf of a user — and it is one of the most consistently misconfigured primitives I run into on red team engagements.

This post is a map of the problem, not a weapon.

## Why delegation exists

A front-end service often needs to reach a back-end as the *user*, not as itself. Classic example: a web server that queries SQL or CIFS on behalf of whoever authenticated.

Kerberos solves this with tickets. Delegation is the policy that says: *this service is allowed to request additional tickets for that user*.

```
Client  →  AS-REQ/AS-REP   →  Domain Controller
Client  →  TGS-REQ/TGS-REP →  Domain Controller
Client  →  AP-REQ          →  Service
Service →  additional TGS  →  (if delegated)
```

The security boundary is not encryption. It is **who is allowed to request what**.

## Unconstrained delegation

Unconstrained delegation is the original, blunt version. A computer or service account with `TrustedForDelegation` can forward a user's TGT and then request tickets to **any** service.

That is an enormous trust grant. If you compromise a host with unconstrained delegation, the interesting question is no longer "can I dump LSASS?" — it is "which privileged tickets will land here?"

Operationally, I treat unconstrained delegation as:

- a **tiering violation** if it sits on anything a workstation user can reach
- a **forced-authentication magnet** (printers, WebDAV, coerce-style callbacks) in lab discussions
- a detection opportunity: unusual TGS-REQ volume from a non-DC host

```powershell
# Authorized lab: enumerate trusted-for-delegation
Get-ADComputer -Filter { TrustedForDelegation -eq $true } -Properties TrustedForDelegation
Get-ADUser -Filter { TrustedForDelegation -eq $true } -Properties TrustedForDelegation
```

If the result includes a print server, a jump box, or a forgotten IIS host, that is the finding. The rest is impact narrative.

## Constrained delegation (KCD)

Constrained delegation (S4U2Proxy / S4U2Self) limits the target SPNs. It is better, and still dangerous when:

- the constrained targets include CIFS, LDAP, HTTP, or HOST on a DC or file server
- protocol transition is enabled (`TrustedToAuthForDelegation`)
- the service account is over-privileged or shareable

The offensive question becomes: *if I control this account, which SPNs can I present a ticket to?* The defensive question is the same sentence with a different budget.

```bash
# Conceptual: inspect msDS-AllowedToDelegateTo
# Use your approved enumeration tooling against a lab DC.
ldapsearch -x -H ldap://dc.lab.local -b "dc=lab,dc=local" \
  "(msDS-AllowedToDelegateTo=*)" \
  sAMAccountName msDS-AllowedToDelegateTo
```

## Resource-based constrained delegation

RBCD flips the ACL: the *resource* decides who may delegate to it (`msDS-AllowedToActOnBehalfOfOtherIdentity`).

This is why machine account creation quotas, GenericWrite/GenericAll on computer objects, and "who can join workstations" still matter in 2026. RBCD is not a fancy exploit class. It is a **write primitive + a Kerberos feature**.

When I review an estate I look for:

- who can create computer objects
- who can write `msDS-AllowedToActOnBehalfOfOtherIdentity`
- which resources are high-value (DCs, ADCS, backup, SCCM, file servers)

## How I write this up

A useful finding is not "Kerberos is broken". A useful finding looks like:

1. **Asset** — `WEB-01$` has unconstrained delegation
2. **Path** — any Domain User can coerce or wait for a privileged logon
3. **Impact** — TGT reuse against LDAP/CIFS on `DC01`
4. **Fix** — remove unconstrained, prefer RBCD with a tight resource ACL, enable PAC validation, protect with tiering
5. **Detect** — 4769 patterns, unusual S4U, new computer objects, ACL changes on computer accounts

## Lab notes

If you are building this at home, keep the lab **air-gapped** from anything you care about. Use a dedicated domain, snapshot before every experiment, and throw the tickets away with the snapshot.

> Breaking things to understand how they work — then putting them back together so they fail closed.

## Further reading

- Microsoft docs on constrained / resource-based constrained delegation
- SpecterOps work on BloodHound edges (`AllowedToDelegate`, `AllowedToAct`)
- Charlie Clark / Elad Shamir research on Kerberos abuse classes

The graph is the model. Delegation is just one edge type. Treat it that way and the rest of AD starts to look less like magic.
