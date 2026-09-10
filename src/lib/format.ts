export function formatDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function tagPath(tag: string): string {
  return `/tags/${slugify(tag)}`;
}

export function uptimeSince(startIso = "2026-01-01"): string {
  const start = new Date(startIso).getTime();
  const now = Date.now();
  const days = Math.max(0, Math.floor((now - start) / 86400000));
  const hours = new Date().getHours().toString().padStart(2, "0");
  const mins = new Date().getMinutes().toString().padStart(2, "0");
  const secs = new Date().getSeconds().toString().padStart(2, "0");
  return `${hours}:${mins}:${secs} up ${days} days,  load 0.12,  0.08,  0.01`;
}
