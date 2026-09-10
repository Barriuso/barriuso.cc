import { useMemo, useState } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { FilterChip, PageHeader } from "../components/PageHeader";
import { Seo } from "../components/Seo";
import { categories, posts } from "../lib/content";

export function Articles() {
  const [cat, setCat] = useState("All");
  const filtered = useMemo(
    () => (cat === "All" ? posts : posts.filter((p) => p.category === cat)),
    [cat],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Seo title="Articles" description="Technical notes on pentesting, AD, web, and red team." path="/articles" />
      <PageHeader
        kicker="$ ls ~/articles"
        title="Articles"
        description="Long-form notes. Methodology over payloads. Written for operators and the people who have to patch after them."
      />
      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip active={cat === "All"} onClick={() => setCat("All")}>
          All
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>
            {c}
          </FilterChip>
        ))}
      </div>
      <p className="mb-4 font-mono text-[11px] text-dim">
        {filtered.length} file{filtered.length === 1 ? "" : "s"}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <ArticleCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
  );
}
