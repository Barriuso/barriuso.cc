import { Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { Seo } from "../components/Seo";
import { Terminal } from "../components/Terminal";
import { ToolCard } from "../components/ToolCard";
import { WriteupCard } from "../components/WriteupCard";
import { SITE, assetUrl } from "../config";
import { posts, tools, writeups } from "../lib/content";
import { IconArrow, IconGithub } from "../components/Icons";

export function Home() {
  const latest = posts.slice(0, 6);
  const featuredTools = tools.filter((t) => t.featured).slice(0, 3);
  const latestWriteups = writeups.slice(0, 3);

  return (
    <>
      <Seo path="/" />
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:py-20 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:py-24">
          <div>
            <p className="fade-up font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
              root@{SITE.name} · offensive security
            </p>
            <div className="fade-up delay-1 mt-6 font-mono text-[12px] leading-relaxed text-muted sm:text-sm">
              <div>
                <span className="text-dim">┌──</span>
                <span className="text-accent">[root@{SITE.name}]</span>
                <span className="text-dim">─[~/]</span>
              </div>
              <div>
                <span className="text-dim">└─</span>
                <span className="text-accent">$</span>
                <span className="ml-2 text-fg-bright">whoami</span>
                <span className="cursor-blink ml-1 align-middle" aria-hidden />
              </div>
            </div>
            <h1 className="fade-up delay-2 mt-8 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fg-bright sm:text-5xl md:text-[3.4rem]">
              Security Researcher
              <span className="mt-2 block text-2xl font-medium text-muted sm:text-3xl">
                Offensive Security
                <br />
                Pentesting · Red Team
              </span>
            </h1>
            <p className="fade-up delay-3 mt-8 max-w-xl text-lg text-muted">
              <span className="text-accent">›</span> {SITE.tagline}
            </p>
            <div className="fade-up delay-4 mt-8 flex flex-wrap gap-3">
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2 font-mono text-[12px] uppercase tracking-wider text-[#050505] hover:brightness-110"
              >
                Read Articles <IconArrow />
              </Link>
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 rounded-sm border border-line px-4 py-2 font-mono text-[12px] uppercase tracking-wider text-fg-bright hover:border-accent/40"
              >
                Explore Tools
              </Link>
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-line px-4 py-2 font-mono text-[12px] uppercase tracking-wider text-muted hover:text-fg-bright"
              >
                <IconGithub /> GitHub
              </a>
            </div>
          </div>
          <figure className="fade-up delay-3 relative hidden md:block">
            <div className="overflow-hidden rounded-md border border-line bg-[#070707] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2 font-mono text-[11px] text-[#8a8a8a]">
                <span className="flex gap-1" aria-hidden>
                  <i className="block h-2 w-2 rounded-full bg-[#3a3a3a]" />
                  <i className="block h-2 w-2 rounded-full bg-[#3a3a3a]" />
                  <i className="block h-2 w-2 rounded-full bg-[#3a3a3a]" />
                </span>
                barriuso@lab — research console
              </div>
              <img
                src={assetUrl("images/hero-console.png")}
                width={1586}
                height={992}
                alt="Illustrated barriuso research console with three fictional lab nodes"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              research lab · illustrative environment
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionKicker title="interactive shell" cmd={`$ ${SITE.shellName}`} />
        <Terminal />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <SectionKicker title="latest articles" cmd="$ ls -lt articles/ | head" to="/articles" />
        <div className="grid gap-4 md:grid-cols-2">
          {latest.map((p) => (
            <ArticleCard key={p.slug} post={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionKicker title="tools" cmd="$ find ./tools -type f" to="/tools" />
        <div className="grid gap-4 md:grid-cols-3">
          {featuredTools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <SectionKicker title="research / writeups" cmd="$ cat writeups/*.md" to="/writeups" />
        <div className="grid gap-4 md:grid-cols-3">
          {latestWriteups.map((w) => (
            <WriteupCard key={w.slug} item={w} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-md border border-line bg-bg-2 px-5 py-8 font-mono text-sm">
          <p className="text-dim">
            └─<span className="text-accent">$</span>{" "}
            <span className="text-fg">echo</span>{" "}
            <span className="text-[#c8facc]">"Stay curious. Break responsibly."</span>
          </p>
          <p className="mt-3 text-fg-bright">Stay curious. Break responsibly.</p>
        </div>
      </section>
    </>
  );
}

function SectionKicker({ title, cmd, to }: { title: string; cmd: string; to?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-fg-bright sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 font-mono text-[11px] text-dim">{cmd}</p>
      </div>
      {to && (
        <Link to={to} className="font-mono text-[11px] uppercase tracking-wider text-muted hover:text-accent">
          view all →
        </Link>
      )}
    </div>
  );
}
