import { useMemo, useState } from "react";
import { FilterChip, PageHeader } from "../components/PageHeader";
import { Seo } from "../components/Seo";
import { WriteupCard } from "../components/WriteupCard";
import { writeups } from "../lib/content";

export function Writeups() {
  const platforms = ["All", ...new Set(writeups.map((w) => w.platform))];
  const diffs = ["All", "Easy", "Medium", "Hard", "Insane"];
  const [platform, setPlatform] = useState("All");
  const [diff, setDiff] = useState("All");

  const filtered = useMemo(
    () =>
      writeups.filter(
        (w) => (platform === "All" || w.platform === platform) && (diff === "All" || w.difficulty === diff),
      ),
    [platform, diff],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Seo
        title="Writeups"
        description="Lab notes from Hack The Box, TryHackMe, and private research environments."
        path="/writeups"
      />
      <PageHeader
        kicker="$ ls ~/writeups"
        title="Writeups"
        description="Authorized labs only. Paths, not payloads. HTB · TryHackMe · Research."
      />
      <div className="mb-3 flex flex-wrap gap-2">
        {platforms.map((p) => (
          <FilterChip key={p} active={platform === p} onClick={() => setPlatform(p)}>
            {p}
          </FilterChip>
        ))}
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {diffs.map((d) => (
          <FilterChip key={d} active={diff === d} onClick={() => setDiff(d)}>
            {d}
          </FilterChip>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((w) => (
          <WriteupCard key={w.slug} item={w} />
        ))}
      </div>
    </div>
  );
}
