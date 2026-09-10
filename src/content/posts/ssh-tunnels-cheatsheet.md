---
title: "SSH Tunnels Cheatsheet"
description: "Local, remote, dynamic, and jump-host patterns I actually type during internal tests."
date: 2026-01-20
author: "Template sample"
tags:
  - Linux
  - Cheat Sheet
  - Network Security
  - SSH
category: "Cheat Sheet"
draft: false
sample: true
---

A compact sheet for authorized labs. Bind to localhost unless you have a reason not to.

## Local forward (`-L`)

Expose a remote service on your box.

```bash
ssh -N -L 127.0.0.1:8080:127.0.0.1:8080 user@jump
ssh -N -L 127.0.0.1:3389:10.10.20.10:3389 user@jump
```

## Remote forward (`-R`)

Expose a local service to the jump host. Easy to get wrong. Easy to leave behind.

```bash
ssh -N -R 127.0.0.1:4444:127.0.0.1:4444 user@jump
```

Prefer `GatewayPorts no` on the jump.

## Dynamic SOCKS (`-D`)

```bash
ssh -N -D 127.0.0.1:1080 user@jump
```

## Jump hosts

```bash
ssh -J user@jump1,user@jump2 user@target
ssh -o ProxyJump=user@jump1 user@target
```

## Config file

```bash
Host jump-01
  HostName 10.10.10.5
  User barriuso
  IdentityFile ~/.ssh/eng-acme
  LocalForward 127.0.0.1:8080 127.0.0.1:8080

Host target-b
  HostName 10.10.20.20
  User barriuso
  ProxyJump jump-01
```

Keep engagement keys **separate** from GitHub keys. Expire them.

## Copy files

```bash
scp -o ProxyJump=user@jump ./notes.md user@target:~/
rsync -e "ssh -J user@jump" -av ./tools/ user@target:~/tools/
```

## Hygiene

```bash
# see what you left open
ss -lntp | grep ssh
# multiplexed control sockets
ls ~/.ssh/ctl 2>/dev/null
```

If a tunnel is not in the engagement `tunnels.sh`, kill it.
