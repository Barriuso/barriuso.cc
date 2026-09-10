import { Link } from "react-router-dom";
import type { Tool } from "../types";
import { IconGithub, IconStar } from "./Icons";
import { TagChip } from "./TagChip";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <article className="card flex min-w-0 flex-col rounded-md p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">{tool.language}</span>
        {tool.stars > 0 && (
          <span
            className="inline-flex items-center gap-1 font-mono text-[11px] text-muted"
            title={tool.starsChecked ? `GitHub stars · checked ${tool.starsChecked}` : "GitHub stars"}
            aria-label={`${tool.stars} GitHub stars`}
          >
            <IconStar />
            {tool.stars}
          </span>
        )}
      </div>
      <h3 className="font-display text-lg font-semibold tracking-tight text-fg-bright [overflow-wrap:anywhere]">
        <Link to={`/tools/${tool.slug}`} className="hover:text-accent">
          {tool.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted">{tool.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tool.tags.slice(0, 3).map((t) => (
          <TagChip key={t} tag={t} />
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <Link
          to={`/tools/${tool.slug}`}
          className="inline-flex items-center rounded-sm border border-line bg-bg-3 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-fg-bright hover:border-accent/40 hover:text-accent"
        >
          View Tool
        </Link>
        {tool.repo && (
          <a
            href={tool.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted hover:text-fg-bright"
          >
            <IconGithub />
            GitHub
          </a>
        )}
      </div>
    </article>
  );
}
