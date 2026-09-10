import { Link, useParams } from "react-router-dom";
import { MarkdownView } from "../components/MarkdownView";
import { Seo } from "../components/Seo";
import { TableOfContents } from "../components/TableOfContents";
import { DifficultyBadge, PlatformBadge, TagChip } from "../components/TagChip";
import { getWriteup } from "../lib/content";
import { formatDate } from "../lib/format";
import { extractHeadings } from "../lib/markdown";
import { NotFound } from "./NotFound";
import { SampleNotice } from "../components/SampleNotice";

export function WriteupPage() {
  const { slug } = useParams();
  const item = slug ? getWriteup(slug) : undefined;
  if (!item) return <NotFound />;
  const headings = extractHeadings(item.content);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Seo title={item.sample ? `${item.title} · Sample` : item.title} description={item.sample ? `Sample content: ${item.description}` : item.description} path={`/writeups/${item.slug}`} />
      <p className="font-mono text-[11px] text-dim">
        <Link to="/writeups" className="hover:text-accent">
          ~/writeups
        </Link>
        <span> / {item.slug}.md</span>
      </p>
      <div className="mt-6 flex flex-wrap gap-1.5">
        <PlatformBadge name={item.platform} />
        <DifficultyBadge level={item.difficulty} />
        <span className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
          {item.os}
        </span>
      </div>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-fg-bright sm:text-5xl">
        {item.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{item.description}</p>
      <p className="mt-4 font-mono text-[12px] text-dim">
        {!item.sample && `${formatDate(item.date)} · `}{item.readingTime} min read · {item.author}
      </p>
      {item.sample && <SampleNotice />}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {item.tags.map((t) => (
          <TagChip key={t} tag={t} />
        ))}
      </div>
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
        <article className="min-w-0">
          <MarkdownView source={item.content} />
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </div>
  );
}
