import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Seo } from "../components/Seo";
import { allTags, contentByTag } from "../lib/content";
import { tagPath } from "../lib/format";

export function Tags() {
  const tags = allTags();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Seo title="Tags" description="Index of topics across articles, writeups, and tools." path="/tags" />
      <PageHeader kicker="$ ls ~/tags" title="Tags" description="Generated from content frontmatter." />
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        {tags.map((t) => {
          const c = contentByTag(t);
          const n = c.posts.length + c.writeups.length + c.tools.length;
          return (
            <Link
              key={t}
              to={tagPath(t)}
              className="card flex items-center justify-between rounded-md px-4 py-3"
            >
              <span className="font-mono text-sm text-fg-bright">{t}</span>
              <span className="font-mono text-[11px] text-dim">{n}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
