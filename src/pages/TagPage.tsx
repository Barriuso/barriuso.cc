import { Link, useParams } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { PageHeader } from "../components/PageHeader";
import { Seo } from "../components/Seo";
import { ToolCard } from "../components/ToolCard";
import { WriteupCard } from "../components/WriteupCard";
import { allTags, contentByTag } from "../lib/content";
import { slugify } from "../lib/format";
import { NotFound } from "./NotFound";

export function TagPage() {
  const { tag } = useParams();
  const match = allTags().find((t) => slugify(t) === tag);
  if (!match) return <NotFound />;
  const data = contentByTag(match);
  const empty = !data.posts.length && !data.writeups.length && !data.tools.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Seo title={`Tag: ${match}`} description={`Content tagged ${match}.`} path={`/tags/${tag}`} />
      <p className="font-mono text-[11px] text-dim">
        <Link to="/tags" className="hover:text-accent">
          ~/tags
        </Link>
        <span> / {slugify(match)}</span>
      </p>
      <PageHeader kicker="$ grep -R" title={match} />
      {empty && <p className="text-muted">No content.</p>}
      {data.posts.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 font-display text-xl text-fg-bright">Articles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.posts.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
      {data.writeups.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 font-display text-xl text-fg-bright">Writeups</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.writeups.map((p) => (
              <WriteupCard key={p.slug} item={p} />
            ))}
          </div>
        </section>
      )}
      {data.tools.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-xl text-fg-bright">Tools</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.tools.map((p) => (
              <ToolCard key={p.slug} tool={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
