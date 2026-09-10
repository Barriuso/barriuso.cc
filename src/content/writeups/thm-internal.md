---
title: "Internal"
description: "TryHackMe-style internal network: WordPress foothold, Jenkins in the middle, and a Windows DC at the end of the tunnel."
date: 2026-02-28
author: "Template sample"
tags:
  - Linux
  - Windows
  - Active Directory
  - TryHackMe
  - Pivoting
category: "Writeup"
difficulty: "Hard"
platform: "TryHackMe"
os: "Linux"
draft: false
sample: true
---

:::note
Authorized training lab. High-level path, no weaponized steps.
:::

Internal is a **pivoting** lesson pretending to be a boot2root.

## External web

WordPress on the public vhost. I treat WP like any CMS:

- users via author enum
- plugins / themes age
- `xmlrpc` only if in scope and useful
- do not brute-force blindly; try the leaked or default lab creds after recon

A theme backup or an editor role is enough for a web shell in the lab. That shell is **www-data** on a Linux jump.

## The inside

From the jump I find Jenkins and a second segment. This is where people spray nmap through proxychains at the whole RFC1918 space and then wonder why the box feels "broken".

```bash
# jump, authorized lab
ip a
ss -lnt
cat /etc/hosts
```

Jenkins is often the real front door to the next identity: a job that runs as a user with an SSH key, or a script with a password in clear text. I read job configs like they are source code.

## Windows side

SOCKS through the jump, then the usual AD ports on the inside host. From here the path is a smaller version of every internal:

```
linux web → jenkins creds → ssh key → windows user → local admin → DC
```

I keep one SOCKS and a written route file. See also the [pivoting article](/#/articles/internal-pivoting-socks).

## Privilege on the DC

Lab-typical: a found credential works on a privileged group, or a mis-set service binary. I stop at evidence of DA and I do not install persistence.

## Takeaways

- WordPress is rarely the interesting part; it is a door
- Jenkins job configs are credential stores
- Draw the network before you add a second tunnel

| Stage | Outcome |
| --- | --- |
| External | WP → linux user |
| Pivot | Jenkins → ssh |
| Internal | Windows foothold |
| DA | credential / service path |
