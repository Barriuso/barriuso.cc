import { Link, useParams } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { MarkdownView } from "../components/MarkdownView";
import { Seo } from "../components/Seo";
import { TableOfContents } from "../components/TableOfContents";
import { TagChip } from "../components/TagChip";
import { getPost, relatedPosts } from "../lib/content";
import { formatDate } from "../lib/format";
import { extractHeadings } from "../lib/markdown";
import { NotFound } from "./NotFound";
import { SampleNotice } from "../components/SampleNotice";

export function ArticlePage() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;
  if (!post) return <NotFound />;
  const headings = extractHeadings(post.content);
  const related = relatedPosts(post);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Seo title={post.sample ? `${post.title} · Sample` : post.title} description={post.sample ? `Sample content: ${post.description}` : post.description} path={`/articles/${post.slug}`} />
      <p className="font-mono text-[11px] text-dim">
        <Link to="/articles" className="hover:text-accent">
          ~/articles
        </Link>
        <span className="text-dim"> / {post.slug}.md</span>
      </p>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">[{post.category}]</p>
      <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-fg-bright sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{post.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] text-dim">
        {!post.sample && <span>{formatDate(post.date)}</span>}
        <span>{post.readingTime} min read</span>
        <span>{post.author}</span>
      </div>
      {post.sample && <SampleNotice />}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {post.tags.map((t) => (
          <TagChip key={t} tag={t} />
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
        <article className="min-w-0">
          <MarkdownView source={post.content} />
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 font-display text-xl font-semibold text-fg-bright">Related</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
