import { useEffect } from "react";
import { SITE } from "../config";

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

export function Seo({
  title,
  description,
  path = "/",
}: {
  title?: string;
  description?: string;
  path?: string;
}) {
  useEffect(() => {
    const full = title ? `${title} — ${SITE.name}` : SITE.title;
    const desc = description || SITE.description;
    const url = `${SITE.url}/#${path}`;
    document.title = full;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", full);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", `${SITE.url}/images/og.png`);
    setMeta("name", "twitter:title", full);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", `${SITE.url}/images/og.png`);
    let link = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  }, [title, description, path]);
  return null;
}
