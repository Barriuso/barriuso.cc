---
title: "BloodHound Graph Thinking"
description: "How I read AD attack graphs without drowning in every shortest path to Domain Admin."
date: 2025-12-11
author: "Template sample"
tags:
  - Active Directory
  - Red Team
  - Pentesting
  - Cheat Sheet
category: "Active Directory"
draft: false
sample: true
---

BloodHound is a compiler for bad ACLs. The skill is not clicking **shortest path**. The skill is asking a better question.

## Questions that pay

- Which **Tier 0** objects are reachable from this specific foothold?
- Which principals have `GenericAll` / `GenericWrite` / `WriteDacl` on computers I already like?
- Where does **Kerberos delegation** sit relative to helpdesk users?
- Which non-admin groups are actually admin-shaped (`Server Operators`, custom "SQL admins", nested disaster)?
- What changed since last quarter? Diff the graphs.

```
foothold user
   → local admin on JUMP-01
      → session of SVC_BACKUP
         → GenericAll on DC-02$
```

One path you can walk beats twenty paths you cannot.

## Edges I actually care about

| Edge | Why |
| --- | --- |
| `AdminTo` | Execution on a host |
| `HasSession` | Credential overlap |
| `CanRDP` / `CanPSRemote` | Practical access |
| `AllowedToDelegate` | Kerberos |
| `AllowedToAct` | RBCD |
| `GenericAll` on computer/user | Takeover |
| `WriteOwner` / `WriteDacl` | Slow takeover |
| `AddMember` | Group-shaped keys |
| `DCSync` rights | Game over, say it plainly |

## Collection hygiene

Collect from a lab or from a scoped DC with agreed tooling. Do not exfiltrate the entire graph to a personal laptop "for later". The graph **is** the crown jewels of the identity model.

Mark the collection time. Stale graphs cause false findings and missed ones.

## Reporting

I screenshot **one** path, then recreate it as an ASCII chain in the report so the finding still works when the PNG dies in email.

> The graph is not the attack. The graph is the map. You still have to walk.

If BloodHound says DA is 2 hops and you cannot name the hops without looking, you do not understand the finding yet. Sit with it.
