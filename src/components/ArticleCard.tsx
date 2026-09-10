import { Link } from "react-router-dom";
import type { Post } from "../types";
import { formatDate } from "../lib/format";
import { TagChip } from "./TagChip";

export function ArticleCard({ post }: { post: Post }) {
  return (
    <article className="card rounded-md p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          [{post.category}]
        </span>
        <span className="font-mono text-[11px] text-dim">{post.sample ? "Sample article" : formatDate(post.date)}</span>
      </div>
      <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-fg-bright">
        <Link to={`/articles/${post.slug}`} className="hover:text-accent">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-muted">{post.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {post.tags.slice(0, 4).map((t) => (
          <TagChip key={t} tag={t} />
        ))}
        <span className="ml-auto font-mono text-[11px] text-dim">{post.readingTime} min read</span>
      </div>
    </article>
  );
}
