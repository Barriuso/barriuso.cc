---
title: "Pilgrimage"
description: "A Linux web box: ImageMagick-adjacent file processing, git leftovers, and a quiet privilege boundary in a helper binary."
date: 2026-05-19
author: "Template sample"
tags:
  - Linux
  - Web
  - Hack The Box
category: "Writeup"
difficulty: "Medium"
platform: "Hack The Box"
os: "Linux"
draft: false
sample: true
---

:::note
Authorized HTB lab. No exploit PoC, no payloads. Path only.
:::

## Recon

```bash
┌──[kali@lab]─[~/htb/pilgrimage]
└─$ nmap -sV -sC 10.10.11.219
```

HTTP and SSH. The site is a small image-shrinker. File-processing web apps are a genre: look at the converter, the temp dir, and the version.

## Initial access

Two things mattered:

1. A `.git` leftover on the web root. Source disclosure. I cloned it locally and read it like a code review, not like a CTF.
2. The image pipeline called a known-vulnerable processing stack. I used the lab to **identify the class** (ImageMagick / binwalk-adjacent file parse) and dropped a crafted image that the converter would mishandle into file read.

From file read to a user credential in a local db or config is the usual second step. SSH as that user.

```
.git → source
image pipeline → arbitrary file read
config/db → user creds → ssh
```

## Privilege escalation

The user could run a helper used to "clean" uploaded images. The binary:

- ran as root via sudo or SUID
- followed a path I could influence (output dir / binwalk extract dir)
- trusted a file name from the upload folder

That is a classic **confused deputy**. The fix is a root-owned work directory and no follow-symlink.

I proved it by writing a single file I should not be able to write, then used that as the report evidence instead of a reverse shell as root.

## Lessons

- Git on production vhosts is still a thing
- File processors are remote code or remote read until proven otherwise
- SUID helpers that call other tools inherit those tools' features (extract, follow, exec)

| Stage | Outcome |
| --- | --- |
| Recon | web + ssh |
| Access | source leak + file read → ssh |
| Root | helper binary / path trust |
