import { Link, useParams } from "react-router-dom";
import { MarkdownView } from "../components/MarkdownView";
import { Seo } from "../components/Seo";
import { TagChip } from "../components/TagChip";
import { IconExternal, IconGithub, IconStar } from "../components/Icons";
import { getTool } from "../lib/content";
import { NotFound } from "./NotFound";
import { assetUrl } from "../config";

export function ToolPage() {
  const { slug } = useParams();
  const tool = slug ? getTool(slug) : undefined;
  if (!tool) return <NotFound />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Seo title={tool.title} description={tool.description} path={`/tools/${tool.slug}`} />
      <p className="font-mono text-[11px] text-dim">
        <Link to="/tools" className="hover:text-accent">
          ~/tools
        </Link>
        <span> / {tool.slug}</span>
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">{tool.language}</span>
        {tool.stars > 0 && (
          <span
            className="inline-flex items-center gap-1 font-mono text-[12px] text-muted"
            title={tool.starsChecked ? `GitHub stars · checked ${tool.starsChecked}` : "GitHub stars"}
          >
            <IconStar /> {tool.stars} stars
          </span>
        )}
      </div>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-fg-bright [overflow-wrap:anywhere]">{tool.title}</h1>
      <p className="mt-4 text-lg text-muted">{tool.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tool.tags.map((t) => (
          <TagChip key={t} tag={t} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {tool.repo && (
          <a
            href={tool.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-line px-3 py-1.5 font-mono text-[12px] uppercase tracking-wider text-fg-bright hover:border-accent/40"
          >
            <IconGithub /> Repository <IconExternal />
          </a>
        )}
      </div>
      {tool.screenshot && (
        <img
          src={assetUrl(tool.screenshot)}
          alt={`${tool.title} screenshot`}
          className="mt-8 w-full rounded-md border border-line"
        />
      )}
      <article className="mt-10">
        <MarkdownView source={tool.content} />
      </article>
    </div>
  );
}
