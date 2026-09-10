---
title: "Web Cache Poisoning for Offensive Security"
description: "A practical model for cache keys, unkeyed inputs, and why CDNs still turn small header bugs into site-wide findings."
date: 2026-04-18
author: "Template sample"
tags:
  - Web
  - Pentesting
  - Research
category: "Web"
draft: false
sample: true
---

Cache poisoning is one of the few web bugs that still feels like magic the first time you hit it. A request you sent becomes the response someone else gets. That is a trust boundary crossing the CDN.

This is how I approach it on **authorized** web tests.

## The model

A cache maps a **key** to a stored response. Anything in the request that *changes the response* but is *not in the key* is an unkeyed input. Unkeyed input + cacheable response = potential poison.

```
key   = (method, host, path, maybe a few headers)
store = full response (including the dangerous bits)
```

I do not start with gadgets. I start with: *what does this cache key on?*

## Recon questions

- Which CDN / reverse proxy is in front? (`server`, `via`, `x-cache`, `cf-ray`, `age`)
- Is the response actually cached? (`age`, `x-cache: HIT`)
- Vary header vs. real key. They lie to each other more often than you think.
- Fat GET? Body in GET? Path normalization? Trailing slash?

```http
GET /en/app HTTP/1.1
Host: shop.lab
X-Forwarded-Host: attacker.lab
```

If the app reflects `X-Forwarded-Host` into an asset URL and the CDN keys only on `Host` + path, you have the primitive. XSS, open redirect, or a poisoned JSON blob is just the payload shape.

## Gadgets I actually use in labs

- reflected absolute URLs in `<script src>`
- unkeyed query parameters that change tracking scripts
- path normalization differences (`/en/app` vs `/en/app/`)
- header smuggling into the origin that the CDN still caches

I keep payloads boring. A unique token in a reflected string is enough to prove cache hit for the report. Nobody needs a drive-by in a pentest PDF.

## Proving it

1. Send a request with a unique canary in the unkeyed input
2. Fetch the same **keyed** URL without the input
3. Show the canary
4. Show `Age` / cache HIT
5. Note TTL and blast radius (path, locale, cookie-less users)

Blast radius is the finding severity. A poisoned `/` on a marketing site is not the same as a poisoned `/api/session`.

## Fixes that stick

- Key on every input that can change the response
- Do not cache authenticated or highly personalized content
- Disable `X-Forwarded-*` reflection at the origin
- Normalize URLs before the cache
- Short TTL is a bandage, not a fix

> Caches are amplifiers. Small input bugs become infrastructure bugs.

If you only remember one thing: **draw the key**. The exploit is a footnote.
