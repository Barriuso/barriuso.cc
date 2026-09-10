---
title: "OPSEC Notes for Red Team Operators"
description: "Quiet habits that keep an authorized simulation from becoming an incident-response exercise against yourself."
date: 2026-03-05
author: "Template sample"
tags:
  - Red Team
  - OPSEC
  - Pentesting
category: "Red Team"
draft: false
sample: true
---

OPSEC on a red team is not a hoodie. It is change control for your own noise.

These are notes I keep for myself. They assume a **scoped, authorized** simulation with a written rules-of-engagement.

## Identity is a build artifact

The operator laptop, the C2 domain, the redirector, the payload naming, the user-agent, the timezone of your traffic — all of that is one identity. If any piece is from your personal life, you have mixed identities.

I treat each engagement as a **project**:

```
eng-2026-acme/
  infra.md        # redirectors, categorisation, expiry
  identity.md     # persona, mail, UA, locale
  kill.sh         # destroy ephemeral infra
```

When the engagement ends, `kill.sh` is not optional.

## Traffic should look like a story

Defenders are good at "this beacon is too square". Jitter, working hours, and protocol choice should match the persona. A finance contractor who only talks HTTPS to a CDN during 08:00–18:00 local is a story. A 24/7 unique JA3 to a fresh VPS is a confession.

I write the story down *before* I generate the first payload.

## Don't steal the client's crash

- no ransomware-like file ops, even as a joke
- no mass password sprays against cloud lockout
- no touching backups "to see if we can"
- no dumping more credentials than the path requires

The extra loot is how you become the incident.

## Logs you should keep

Ironic, but you need logs. Your own.

| Log | Why |
| --- | --- |
| Command history per host | Replay for the report |
| Tunnel inventory | Teardown |
| Credential access | Chain of custody |
| Out-of-hours actions | Deconfliction |

If IR calls the white cell at 03:00, you should be able to say exactly which action was yours.

## Personal rules

1. No engagement tooling on a personal browser profile
2. No screenshots in unencrypted chat
3. No reuse of lab infrastructure on a client
4. If I am unsure it is in scope, I stop

:::warn
OPSEC is not an excuse to hide work from the white cell. Deconfliction beats cleverness.
:::

Quiet is a side effect of discipline. The discipline is the skill.
