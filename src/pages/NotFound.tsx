import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { SITE } from "../config";

export function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <Seo title="404" description="No such file or directory." path="/404" />
      <p className="font-mono text-sm text-muted">
        {SITE.shellName}: <span className="text-danger">path</span>: No such file or directory
      </p>
      <h1 className="mt-6 font-display text-5xl font-semibold text-fg-bright">404</h1>
      <p className="mt-3 text-muted">That route is not in this tree. Try `ls` from home.</p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-sm border border-line px-4 py-2 font-mono text-[12px] uppercase tracking-wider text-accent hover:border-accent/40"
      >
        cd ~
      </Link>
    </div>
  );
}
