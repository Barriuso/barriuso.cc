---
title: "SSRF to Cloud Metadata — Lab Notes"
description: "A research writeup of a deliberately broken image-fetch endpoint and how cloud metadata still shows up in 2026 apps."
date: 2026-09-01
author: "Template sample"
tags:
  - Web
  - Research
  - Cloud
  - SSRF
category: "Writeup"
difficulty: "Medium"
platform: "Research"
os: "Linux"
draft: false
sample: true
---

:::warn
Isolated lab VPC. I never pointed this at a real cloud account. Metadata endpoints are **production credentials**.
:::

## The bug

A feature: "preview this URL as a thumbnail". The server fetches the URL. That is SSRF in its pure form.

I confirmed the fetch was server-side with a canary on a listener I controlled inside the lab VPC.

```
POST /api/preview  { "url": "http://canary.lab/token" }
```

The app followed redirects. That is the whole primitive.

## Metadata

Cloud IMDS is the classic impact story:

- AWS: `169.254.169.254`
- GCP / Azure have their own shapes and header requirements now

Modern IMDS (v2) wants a header token. Older stacks do not. The lab image was old on purpose.

I did **not** pull real IAM creds. I pulled the `iam/security-credentials/` listing on a fake IMDS stub to prove the class, then stopped.

## Extra impact

Because the fetcher used a shared HTTP client:

- it could hit `http://127.0.0.1:2375` (open docker, lab-only)
- it could hit internal admin panels on RFC1918
- it cached nothing (good) but logged the URL (also a finding)

## Fixes I recommended in the notes

1. Allowlist schemes and hosts
2. Block link-local, loopback, RFC1918 unless the feature needs them (it does not)
3. No redirects, or only to the allowlist
4. IMDSv2 + hop limit on the real cloud later
5. Treat preview workers as their own identity with no IAM beyond S3 out

## Detection

Egress from the app subnet to `169.254.169.254` should be a page. If your SIEM cannot see that, the finding is also a monitoring gap.

> SSRF is not "URL injection". It is the app becoming your packet.

| Stage | Outcome |
| --- | --- |
| Primitive | server-side fetch + redirects |
| Impact class | IMDS / internal HTTP |
| Proof | canary + stub metadata |
| Fix | allowlist + no link-local |
