import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SITE } from "../config";
import { allTags, posts, tools, writeups } from "../lib/content";
import { tagPath } from "../lib/format";
import type { SearchItem } from "../types";
import { useTheme } from "./Theme";
import { IconSearch } from "./Icons";

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { toggle } = useTheme();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  const items = useMemo(() => buildItems(), []);
  const results = useMemo(() => Object.values(group(filterItems(items, q))).flat().map(({item}) => item), [items, q]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setActive(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    const prev = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  useEffect(() => {
    if (open) activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function go(item: SearchItem) {
    if (item.action === "theme") {
      toggle();
      onClose();
      return;
    }
    if (item.href) {
      window.open(item.href, "_blank", "noreferrer");
      onClose();
      return;
    }
    if (item.to) {
      navigate(item.to);
      onClose();
    }
  }

  if (!open) return null;

  const grouped = group(results);

  return (
    <div ref={dialogRef} className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input, a[href], [tabindex="0"]') || []);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {event.preventDefault();last?.focus();}
      if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first?.focus();}
    }}>
      <button type="button" className="absolute inset-0 bg-black/70" aria-label="Close search" onClick={onClose} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-lg border border-line-strong bg-bg-2 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <div className="flex items-center gap-2 border-b border-line px-3 py-3">
          <IconSearch className="text-dim" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.max(0, Math.min(a + 1, results.length - 1)));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              }
              if (e.key === "Enter" && results[active]) go(results[active]);
            }}
            placeholder="Search articles, writeups, tools, tags…"
            className="w-full bg-transparent font-mono text-sm text-fg-bright outline-none placeholder:text-dim"
            aria-label="Search"
          />
          <kbd>esc</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 && (
            <p className="px-4 py-6 font-mono text-xs text-dim">no matches for “{q}”</p>
          )}
          {Object.entries(grouped).map(([kind, list]) => (
            <div key={kind} className="mb-2">
              <div className="px-4 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                {kind}
              </div>
              {list.map(({ item, index }) => (
                <button
                  key={item.id}
                  ref={index === active ? activeRef : undefined}
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(item)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm ${
                    index === active ? "bg-accent-dim text-fg-bright" : "text-fg"
                  }`}
                >
                  <span>
                    <span className="block">{item.title}</span>
                    {item.subtitle && (
                      <span className="block font-mono text-[11px] text-muted">{item.subtitle}</span>
                    )}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-dim">{item.kind}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t border-line px-4 py-2 font-mono text-[10px] text-dim">
          <span>↑↓ navigate · ↵ open</span>
          <span>ctrl + k</span>
        </div>
      </div>
    </div>
  );
}

function buildItems(): SearchItem[] {
  const pages: SearchItem[] = [
    { id: "p-home", kind: "page", title: "Home", to: "/", subtitle: "~/" },
    { id: "p-art", kind: "page", title: "Articles", to: "/articles", subtitle: "~/articles" },
    { id: "p-wr", kind: "page", title: "Writeups", to: "/writeups", subtitle: "~/writeups" },
    { id: "p-to", kind: "page", title: "Tools", to: "/tools", subtitle: "~/tools" },
    { id: "p-ab", kind: "page", title: "About", to: "/about", subtitle: "~/about.txt" },
    { id: "p-tags", kind: "page", title: "Tags", to: "/tags", subtitle: "~/tags" },
  ];
  const actions: SearchItem[] = [
    { id: "a-theme", kind: "action", title: "Toggle theme", action: "theme", subtitle: "dark / light" },
    { id: "a-gh", kind: "action", title: "GitHub", href: SITE.github, subtitle: SITE.github },
  ];
  const art: SearchItem[] = posts.map((p) => ({
    id: `a-${p.slug}`,
    kind: "article",
    title: p.title,
    subtitle: p.description,
    to: `/articles/${p.slug}`,
    tags: p.tags,
  }));
  const wr: SearchItem[] = writeups.map((p) => ({
    id: `w-${p.slug}`,
    kind: "writeup",
    title: p.title,
    subtitle: `${p.platform} · ${p.difficulty}`,
    to: `/writeups/${p.slug}`,
    tags: p.tags,
  }));
  const to: SearchItem[] = tools.map((p) => ({
    id: `t-${p.slug}`,
    kind: "tool",
    title: p.title,
    subtitle: p.language,
    to: `/tools/${p.slug}`,
    tags: p.tags,
  }));
  const tags: SearchItem[] = allTags().map((t) => ({
    id: `tag-${t}`,
    kind: "tag",
    title: t,
    to: tagPath(t),
    subtitle: "tag",
  }));
  return [...pages, ...actions, ...art, ...wr, ...to, ...tags];
}

function filterItems(items: SearchItem[], q: string): SearchItem[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return items.filter((i) => i.kind === "page" || i.kind === "action").slice(0, 12);
  return items
    .map((item) => ({ item, s: score(needle, item) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 24)
    .map((x) => x.item);
}

function score(q: string, item: SearchItem): number {
  const hay = `${item.title} ${item.subtitle || ""} ${(item.tags || []).join(" ")}`.toLowerCase();
  if (hay === q) return 100;
  if (item.title.toLowerCase().startsWith(q)) return 80;
  if (hay.includes(q)) return 50;
  const parts = q.split(/\s+/);
  if (parts.every((p) => hay.includes(p))) return 30;
  return 0;
}

function group(results: SearchItem[]) {
  const order = ["page", "action", "article", "writeup", "tool", "tag"];
  const map: Record<string, { item: SearchItem; index: number }[]> = {};
  results.forEach((item, index) => {
    if (!map[item.kind]) map[item.kind] = [];
    map[item.kind].push({ item, index });
  });
  const out: Record<string, { item: SearchItem; index: number }[]> = {};
  for (const k of order) if (map[k]) out[k] = map[k];
  return out;
}
