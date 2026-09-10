import type { Heading } from "../lib/markdown";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (!headings.length) return null;
  return (
    <nav aria-label="Table of contents" className="text-sm">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">toc</div>
      <ol className="space-y-1.5 border-l border-line">
        {headings.map((h) => (
          <li key={h.id} className={h.level > 2 ? "ml-3" : ""}>
            <button
              type="button"
              onClick={() =>
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="block w-full border-l-2 border-transparent px-3 py-0.5 text-left text-[13px] text-muted hover:border-accent hover:text-accent"
            >
              {h.text}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
