---
title: "Linux Privilege Escalation: A Repeatable Methodology"
description: "A calm, operator-friendly way to go from a low-priv shell to a documented root path without spraying exploits."
date: 2026-08-22
author: "Template sample"
tags:
  - Linux
  - Privilege Escalation
  - Pentesting
  - Cheat Sheet
category: "Linux"
draft: false
sample: true
---

:::note
This is a methodology for **authorized** labs and engagements. I do not keep a public exploit folder. Enumeration first. Always.
:::

A Linux privesc that you cannot explain is not a privesc. It is a lucky crash. I want a path I can write up, reproduce, and hand to a sysadmin without shame.

## The loop

```
1. Who am I, and what can I already touch?
2. What is the box trying to be? (role, packages, mounts)
3. Where does trust leak? (sudo, SUID, caps, timers, sockets, creds)
4. Prove one path. Stop spraying.
5. Document. Then escalate.
```

I run this loop twice: once by hand so I understand the host, once with a script so I do not miss the boring stuff.

## Identity and surface

```bash
┌──[kali@lab]─[~/pentest]
└─$ id; hostnamectl; cat /etc/os-release
└─$ sudo -l
└─$ findmnt -A
└─$ ss -lntp
```

`sudo -l` is still the highest-ROI command on Linux. A single NOPASSWD rule on a script owned by your user is a complete finding. Read the script. Do not jump to a GTFOBins page before you know what the script *does*.

## The usual buckets

I keep six buckets. If a host does not fall into one of them, I am missing something, not "the box is hard".

| Bucket | What I look at |
| --- | --- |
| sudo | NOPASSWD, env_keep, wildcards, relative paths |
| SUID/SGID | custom binaries, writable parents, injected libs |
| Capabilities | `cap_setuid`, `cap_dac_override`, `getcap -r /` |
| Scheduled | cron, systemd timers, writable units |
| Secrets | `.env`, cloud metadata, SSH keys, history, world-readable backups |
| Containers | docker.sock, privileged pods, host mounts |

```bash
getcap -r / 2>/dev/null
find / -perm -4000 -type f 2>/dev/null
systemctl list-timers --all
ls -la /var/spool/cron /etc/cron.*
```

## Capabilities are the new SUID

Plenty of "hardened" images strip SUID and then ship `python3` with `cap_setuid`. If you only grep for SUID you will miss 2024–2026 hosts.

Write the finding as a capability grant, not as "Python RCE". The fix is a file capability, a package choice, or a container profile.

## Containers

If you land inside a container, the question is not "is there a kernel exploit?". The questions are:

- am I privileged?
- is the Docker/containerd socket mounted?
- is `/` or `/var/run` from the host?
- can I talk to the cloud metadata endpoint?

Kernel exploits are last. They are noisy, brittle, and hard to justify in a client report.

## How I write the report

```
Initial access : www-data via authorized web test
Check          : sudo -l → /usr/local/bin/backup.sh NOPASSWD
Bug            : script is writable by www-data
Impact         : root command execution
Fix            : root-owned script, drop sudo, use a dedicated backup user
```

One path. Evidence. Fix. That is the whole job.

## Cheatsheet fragment

```bash
# sudo
sudo -n -l

# writable path hijack (lab)
echo $PATH
ls -ld $(echo $PATH | tr ':' ' ')

# systemd
systemctl list-units --type=service --state=running
```

Stay boring. Boring is reproducible. Reproducible is professional.
