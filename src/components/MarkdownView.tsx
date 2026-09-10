import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { parseBlocks, type MdBlock } from "../lib/markdown";
import { CodeBlock } from "./CodeBlock";
import { assetUrl } from "../config";

export function MarkdownView({ source }: { source: string }) {
  const blocks = parseBlocks(source);
  return (
    <div className="prose-barriuso">
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  );
}

function Block({ block }: { block: MdBlock }) {
  switch (block.type) {
    case "h": {
      const Tag = (`h${block.level}` as unknown) as "h2";
      return (
        <Tag id={block.id}>
          <button
            type="button"
            className="heading-anchor"
            aria-label={`Link to ${block.text}`}
            onClick={() =>
              document.getElementById(block.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            #
          </button>
          <Inline text={block.text} />
        </Tag>
      );
    }
    case "p":
      return (
        <p>
          <Inline text={block.text} />
        </p>
      );
    case "code":
      return <CodeBlock code={block.code} lang={block.lang} meta={block.meta} />;
    case "ul":
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>
              <Inline text={it} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((it, i) => (
            <li key={i}>
              <Inline text={it} />
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote>
          <Inline text={block.text} />
        </blockquote>
      );
    case "hr":
      return <hr />;
    case "table":
      return (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i}>
                    <Inline text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((c, ci) => (
                    <td key={ci}>
                      <Inline text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout": {
      const color =
        block.kind === "warn"
          ? "border-warn/40 text-fg"
          : block.kind === "info"
            ? "border-cyan/40"
            : "border-accent/35";
      const label = block.kind === "warn" ? "warn" : block.kind === "info" ? "info" : "note";
      return (
        <aside className={`my-5 rounded-md border bg-bg-2 px-4 py-3 ${color}`}>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{label}</div>
          <div className="text-sm leading-relaxed">
            <Inline text={block.text} />
          </div>
        </aside>
      );
    }
    default:
      return null;
  }
}

function Inline({ text }: { text: string }) {
  const re =
    /(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<Token key={k++} raw={m[0]} />);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}

function Token({ raw }: { raw: string }) {
  if (raw.startsWith("`")) {
    return <code>{raw.slice(1, -1)}</code>;
  }
  if (raw.startsWith("**")) {
    return <strong>{raw.slice(2, -2)}</strong>;
  }
  if (raw.startsWith("*")) {
    return <em>{raw.slice(1, -1)}</em>;
  }
  const img = raw.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (img) {
    return (
      <img src={assetUrl(img[2])} alt={img[1]} className="my-4 max-w-full rounded-md border border-line" />
    );
  }
  const link = raw.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (link) {
    const href = link[2];
    const label = link[1];
    if (href.startsWith("http") || href.startsWith("mailto:")) {
      return (
        <a href={href} target="_blank" rel="noreferrer">
          {label}
        </a>
      );
    }
    const to = href.replace(/^\/#/, "") || "/";
    return <Link to={to}>{label}</Link>;
  }
  return <>{raw}</>;
}
