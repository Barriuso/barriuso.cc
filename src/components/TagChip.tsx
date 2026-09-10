import { Link } from "react-router-dom";
import { tagPath } from "../lib/format";
import { cn } from "../utils/cn";

export function TagChip({ tag, className }: { tag: string; className?: string }) {
  return (
    <Link
      to={tagPath(tag)}
      className={cn(
        "inline-flex items-center rounded-sm border border-line bg-bg-3 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted hover:border-accent/40 hover:text-accent",
        className,
      )}
    >
      {tag}
    </Link>
  );
}

export function DifficultyBadge({ level }: { level: string }) {
  const color =
    level === "Easy"
      ? "text-accent border-accent/30"
      : level === "Medium"
        ? "text-warn border-warn/30"
        : level === "Hard"
          ? "text-danger border-danger/30"
          : "text-violet border-violet/30";
  return (
    <span className={cn("rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider", color)}>
      {level}
    </span>
  );
}

export function PlatformBadge({ name }: { name: string }) {
  return (
    <span className="rounded-sm border border-line bg-bg-3 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-bright">
      {name}
    </span>
  );
}
