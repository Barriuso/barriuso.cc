---
title: "Forest"
description: "Initial access through a writable SMB share to Kerberos-shaped privilege escalation on a Windows domain controller lab."
date: 2026-08-01
author: "Template sample"
tags:
  - Active Directory
  - Kerberos
  - Windows
  - Hack The Box
category: "Writeup"
difficulty: "Hard"
platform: "Hack The Box"
os: "Windows"
draft: false
sample: true
---

:::note
Hack The Box lab. Authorized playground. I omit payloads, hashes, and exploit code — the point is the path.
:::

**Forest** is a clean AD teaching box: anonymous-ish enumeration, a service account with a weak Kerberos configuration, and a DC that rewards graph thinking more than memory corruption.

## Recon

```bash
┌──[kali@lab]─[~/htb/forest]
└─$ nmap -sV -sC 10.10.10.161
```

The interesting ports are the usual AD set: 53, 88, 135, 139, 389, 445, 464, 593, 636. I treat that as "this is a DC" until proven otherwise.

LDAP and SMB both give away the domain name and a handful of users. I keep a `users.txt` and I do not spray. Password policy first, always.

## Initial access

A service account with **AS-REP** roasting possible (no pre-auth) is the foothold class. In the lab this is the intended door: enumerate users, identify the account, crack the blob **offline** in the lab wordlist, WinRM in.

```
enum users → no-preauth account → offline crack → winrm
```

I will not drop the hash format here. If you are learning, generate it in *your* lab and look at it once so you recognize it later.

## Domain standing

From a low-priv domain user:

- BloodHound collection (agreed lab method)
- membership of `Account Operators` or equivalent helpdesk-shaped group on this box
- that group is the real finding — it is a **tiering failure**

Account Operators can manage non-admin users and some groups. Combined with a path to a DC, that is enough.

## Privilege escalation

The path I used:

```
User
  → Account Operators
    → write on an exchange-related / service principal
      → DCSync-shaped rights
        → Domain Admin
```

Exact object names change as HTB retires boxes. The **pattern** does not: a built-in group that looks harmless, an ACL that was never reviewed, Kerberos or replication rights at the end.

## Root / DA

I document DA as:

1. evidence of the ACL
2. evidence of the replication right
3. a single secret used to prove access
4. a teardown note

No persistence. Snapshots exist for a reason.

## What I would tell a client

If this were a real estate, I would not lead with "AS-REP roast". I would lead with:

- pre-authentication disabled on a service account
- a built-in group still in use as a role
- no tiering between helpdesk and identity systems

Patches do not fix that. Roles do.

## Timeline

| Stage | Outcome |
| --- | --- |
| Recon | DC, domain, user list |
| Access | service account, WinRM |
| Standing | helpdesk-shaped group |
| DA | ACL → replication rights |
