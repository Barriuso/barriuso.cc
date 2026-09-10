import { slugify } from "./format";

export type MdBlock =
  | { type: "h"; level: 1 | 2 | 3 | 4; text: string; id: string }
  | { type: "p"; text: string }
  | { type: "code"; lang: string; meta: string; code: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "hr" }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; kind: "note" | "warn" | "info"; text: string };

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(source: string): Heading[] {
  return parseBlocks(source)
    .filter((b): b is Extract<MdBlock, { type: "h" }> => b.type === "h" && b.level >= 2)
    .map((b) => ({ id: b.id, text: b.text, level: b.level }));
}

export function parseBlocks(source: string): MdBlock[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: MdBlock[] = [];
  let i = 0;
  const usedIds = new Map<string, number>();

  const uniqueId = (text: string) => {
    const base = slugify(text) || "section";
    const n = usedIds.get(base) ?? 0;
    usedIds.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith(":::")) {
      const kindRaw = line.slice(3).trim().toLowerCase();
      const kind = (["note", "warn", "info"].includes(kindRaw) ? kindRaw : "note") as
        | "note"
        | "warn"
        | "info";
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith(":::")) {
        buf.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({ type: "callout", kind, text: buf.join("\n").trim() });
      continue;
    }

    if (line.startsWith("```")) {
      const info = line.slice(3).trim();
      const [lang, ...rest] = info.split(/\s+/);
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({
        type: "code",
        lang: lang || "text",
        meta: rest.join(" "),
        code: buf.join("\n"),
      });
      continue;
    }

    if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }

    const hm = line.match(/^(#{1,4})\s+(.+)$/);
    if (hm) {
      const level = hm[1].length as 1 | 2 | 3 | 4;
      const text = hm[2].trim();
      blocks.push({ type: "h", level, text, id: uniqueId(text) });
      i += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const buf: string[] = [line.replace(/^>\s?/, "")];
      i += 1;
      while (i < lines.length && lines[i].startsWith(">")) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", text: buf.join(" ") });
      continue;
    }

    if (/^\|.+\|/.test(line) && i + 1 < lines.length && /^\|\s*:?-/.test(lines[i + 1])) {
      const headers = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\|.+\|/.test(lines[i])) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const buf: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith(":::") &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      buf.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: "p", text: buf.join(" ") });
  }

  return blocks;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}
