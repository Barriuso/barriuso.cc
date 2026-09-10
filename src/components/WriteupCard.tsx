import { Link } from "react-router-dom";
import type { Writeup } from "../types";
import { formatDate } from "../lib/format";
import { DifficultyBadge, PlatformBadge } from "./TagChip";

export function WriteupCard({ item }: { item: Writeup }) {
  return (
    <article className="card rounded-md p-5">
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <PlatformBadge name={item.platform} />
        <DifficultyBadge level={item.difficulty} />
        <span className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
          {item.os}
        </span>
        <span className="ml-auto font-mono text-[11px] text-dim">{item.sample ? "Sample writeup" : formatDate(item.date)}</span>
      </div>
      <h3 className="font-display text-lg font-semibold tracking-tight text-fg-bright">
        <Link to={`/writeups/${item.slug}`} className="hover:text-accent">
          {item.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-muted">{item.description}</p>
      <p className="mt-4 font-mono text-[11px] text-dim">
        Initial Access → Privilege Escalation → {item.os === "Windows" ? "DA / Root" : "Root"}
      </p>
    </article>
  );
}
