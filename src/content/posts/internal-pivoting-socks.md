---
title: "Internal Pivoting with SOCKS, SSH and Proxychains"
description: "How I build a quiet, understandable path through a segmented lab network without turning my laptop into a router farm."
date: 2026-07-14
author: "Template sample"
tags:
  - Network Security
  - Pivoting
  - Linux
  - Red Team
category: "Network Security"
draft: false
sample: true
---

Pivoting is where a lot of operators get messy. Too many tunnels, too many shells, no diagram. I want a path I can still explain at 02:00.

This note is about **authorized internal labs**: jump hosts you already control, SSH you already have, SOCKS you intentionally stand up.

## One picture

```
[operator] --ssh--> [jump-01] --socks--> [segment B]
                          \
                           --ssh--> [jump-02] --> [segment C]
```

If I cannot draw it, I do not add another hop.

## SSH first

SSH is still the cleanest transport I have. Dynamic SOCKS:

```bash
┌──[barriuso@lab]─[~/]
└─$ ssh -N -D 1080 jump-01
```

Then a tool that speaks SOCKS, or proxychains for the ones that do not.

```yaml
# proxychains.conf (lab)
strict_chain
proxy_dns
[ProxyList]
socks5  127.0.0.1 1080
```

Local port forwards for a single service beat a full SOCKS when I only need LDAP or RDP to one host.

```bash
ssh -N -L 3389:10.10.20.10:3389 jump-01
```

## What I refuse to do

- chain three SOCKS just because I can
- run a reverse tunnel from a production jump box to a VPS I do not control
- leave listeners bound to `0.0.0.0` on a shared operator laptop
- mix personal browser traffic into the engagement proxy

Bind to `127.0.0.1`. Log the hop. Kill it when the task ends.

## SOCKS and DNS

Most pivoting bugs I see are DNS bugs. The operator resolves names on the wrong side of the tunnel, then wonders why SMB "doesn't work".

Decide explicitly:

- resolve on the **far** side (proxy DNS) when names only exist internally
- resolve on the **near** side when you are targeting raw IPs

Write that decision in the notes. Future you will not remember.

## Windows jump

From a Windows foothold I prefer a dedicated SOCKS implant or an SSH client over ad-hoc `netsh` portproxy. `portproxy` is noisy, survives longer than you think, and shows up in incident reviews.

If the test is scoped for it, document the listener, the bind address, and the teardown command in the same paragraph as the setup.

## Operator hygiene

```
~/eng/acme-2026/
  notes.md
  routes.txt
  loot/          # tickets, hashes — encrypted, not in git
  tunnels.sh     # the only allowed way to stand things up
```

`tunnels.sh` is the source of truth. If a tunnel is not in that file, it should not exist.

> Stay curious. Break responsibly. Tear the sockets down.
