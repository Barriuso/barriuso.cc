---
title: "NTLM Relay in Modern Environments"
description: "What still makes NTLM relay possible in 2026, and how I talk about it without cargo-culting 2015 blog posts."
date: 2026-06-02
author: "Template sample"
tags:
  - Active Directory
  - Windows
  - Network Security
  - Pentesting
category: "Active Directory"
draft: false
sample: true
---

NTLM should be a legacy protocol. It is not. I still find it on file shares, printers, VPNs, older IIS, and "temporary" app servers that outlived three CISOs.

Relay is not a single CVE. It is a family of **authentication forwarding** bugs that exist whenever a challenge-response protocol is accepted without channel binding or signing.

## The shape of the problem

```
Victim --NTLM--> Attacker-controlled listener
Attacker       --relays--> Target that still accepts NTLM
```

Three conditions show up in every lab writeup that is honest:

1. a way to **trigger** authentication (browse, print, coerce, mis-typed UNC, …)
2. a **target** that accepts NTLM and does not require signing
3. a **session** that is privileged enough to matter

Remove any one of those and the class dies. That is also how you fix it.

## What actually changed

SMB signing, EPA, channel binding, LDAP signing/sealing, and the slow death of LM/NTLMv1 all raised the floor. The ceiling is still ugly because:

- printers and NAS devices negotiate like it is 2008
- "disable NTLM" projects stall on one line-of-business app
- web apps with NTLM SSO and no EPA still exist
- AD CS HTTP endpoints have been a gift that keeps on giving in labs

I no longer open with "run responder". I open with an inventory.

```powershell
# Lab questions, not a playbook
# - Where is NTLM still accepted?
# - Which hosts require SMB signing?
# - Is LDAP signing required?
# - Which HTTP endpoints speak Negotiate/NTLM?
```

## Talking to defenders

The useful report section is a table, not a screenshot of a tool banner.

| Control | Why it matters |
| --- | --- |
| SMB signing required | Stops classic SMB relay |
| LDAP signing + channel binding | Shrinks LDAP relay |
| EPA on IIS | Ties HTTP auth to TLS |
| Disable NTLM where possible | Removes the protocol |
| Account tiering | Stolen auth should not be DA |

If the client cannot disable NTLM this quarter, say so. Give them the compensating controls. Do not pretend a registry meme will save a factory floor.

## Operator notes

- Prefer targeted triggers over subnet-wide poisoning. Broadcast poisoning is loud and often out of scope.
- Treat relayed sessions as **client credentials**. They go in the encrypted loot store, not in Slack.
- If you cannot explain the relay target in one sentence, you are not ready to click.

:::info
I keep a private lab with an old NAS, a printer emulator, and a DC with signing turned off so I can *see* the difference when signing is enabled. That single A/B test teaches more than another tool flag.
:::

NTLM relay is a protocol-hygiene problem. Treat it like rust in a ship hull, not like a magic trick.
