import { PageHeader } from "../components/PageHeader";
import { Seo } from "../components/Seo";
import { ToolCard } from "../components/ToolCard";
import { tools } from "../lib/content";

export function Tools() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Seo title="Tools" description="Python utilities, security research projects, and reference material from Barriuso's GitHub." path="/tools" />
      <PageHeader
        kicker="$ find ./tools -maxdepth 1"
        title="Tools"
        description="Python utilities, security research projects, and reference material from my GitHub."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </div>
  );
}
