import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SITE, assetUrl } from "../config";
import { uptimeSince } from "../lib/format";
import { IconGithub, IconRss } from "./Icons";

export function Footer() {
  const [uptime, setUptime] = useState(uptimeSince());
  useEffect(() => {
    const id = window.setInterval(() => setUptime(uptimeSince()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="font-mono text-[12px] text-dim">
          {SITE.promptUser}@{SITE.name}:~$ <span className="text-muted">uptime</span>
        </p>
        <p className="mt-1 font-mono text-[12px] text-muted">{uptime}</p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-sm text-muted">
            <p>
              Built with React · Static research notebook
            </p>
            <p className="mt-1 font-mono text-[12px] text-dim">
              © {SITE.year} {SITE.author} · // security research · 0xDEADBEEF
            </p>
          </div>
          <div className="flex items-center gap-4 font-mono text-[12px] text-muted">
            <a href={SITE.github} className="inline-flex items-center gap-1.5 hover:text-accent" target="_blank" rel="noreferrer">
              <IconGithub /> GitHub
            </a>
            <a href={assetUrl("rss.xml")} className="inline-flex items-center gap-1.5 hover:text-accent">
              <IconRss /> RSS
            </a>
            <Link to="/tags" className="hover:text-accent">
              tags
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
