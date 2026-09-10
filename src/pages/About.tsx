import { Seo } from "../components/Seo";
import { SITE, assetUrl } from "../config";
import { IconGithub } from "../components/Icons";

const AREAS = [
  "Active Directory",
  "Web Security",
  "Linux",
  "Windows",
  "Network Security",
  "Red Team",
  "Exploitation",
];

export function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Seo
        title="About"
        description="Offensive security, pentesting, and research notes by barriuso."
        path="/about"
      />
      <p className="font-mono text-[12px] text-dim">
        └─<span className="text-accent">$</span> cat about.txt
      </p>
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-fg-bright">barriuso</h1>
      <p className="mt-2 font-mono text-sm text-accent">
        Offensive Security · Pentesting · Security Research
      </p>
      <img
        src={assetUrl("images/about-desk.png")}
        alt="Night desk used for lab work — empty chair, dark terminals"
        className="mt-8 w-full rounded-md border border-line"
      />
      <div className="prose-barriuso mt-8">
        <p>
          This is barriuso's notebook for security research, lab learning, and public Python
          projects. The Tools section links to the projects on GitHub and credits their contributors.
        </p>
        <p>
          Articles and writeups currently marked as sample content demonstrate the format of this
          notebook. They will be replaced with reviewed research and lab notes.
        </p>
      </div>
      <h2 className="mt-10 font-display text-xl font-semibold text-fg-bright">Areas</h2>
      <ul className="mt-3 space-y-1 font-mono text-sm text-muted">
        {AREAS.map((a) => (
          <li key={a}>
            <span className="text-accent">›</span> {a}
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={SITE.github}
          className="inline-flex items-center gap-2 rounded-sm border border-line px-3 py-2 font-mono text-[12px] uppercase tracking-wider text-fg-bright hover:border-accent/40"
          target="_blank"
          rel="noreferrer"
        >
          <IconGithub /> GitHub
        </a>
      </div>
    </div>
  );
}
