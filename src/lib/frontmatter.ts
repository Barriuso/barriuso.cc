export function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const text = raw.replace(/^\uFEFF/, "");
  if (!text.startsWith("---")) {
    return { data: {}, content: text };
  }
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { data: {}, content: text };
  const yaml = text.slice(3, end).replace(/^\r?\n/, "");
  const content = text.slice(end + 4).replace(/^\r?\n/, "");
  return { data: parseYaml(yaml), content };
}

function parseYaml(yaml: string): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  const lines = yaml.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i += 1;
      continue;
    }
    const match = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!match) {
      i += 1;
      continue;
    }
    const key = match[1];
    const rest = match[2];
    if (rest === "" || rest === "|" || rest === ">") {
      const items: string[] = [];
      i += 1;
      while (i < lines.length && /^\s+-\s+/.test(lines[i])) {
        items.push(unquote(lines[i].replace(/^\s+-\s+/, "").trim()));
        i += 1;
      }
      data[key] = items;
      continue;
    }
    if (rest.startsWith("[")) {
      const inner = rest.replace(/^\[/, "").replace(/\]$/, "");
      data[key] = inner
        .split(",")
        .map((s) => unquote(s.trim()))
        .filter(Boolean);
      i += 1;
      continue;
    }
    data[key] = coerce(unquote(rest.trim()));
    i += 1;
  }
  return data;
}

function unquote(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function coerce(value: string): unknown {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

export function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

export function asBool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

export function asNumber(v: unknown, fallback = 0): number {
  return typeof v === "number" && !Number.isNaN(v) ? v : fallback;
}

export function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string" && v) return [v];
  return [];
}
