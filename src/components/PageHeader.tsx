export function PageHeader({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{kicker}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg-bright sm:text-4xl">
        {title}
      </h1>
      {description && <p className="mt-3 max-w-2xl text-muted">{description}</p>}
    </header>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${
        active
          ? "border-accent/40 bg-accent-dim text-accent"
          : "border-line text-muted hover:text-fg-bright"
      }`}
    >
      {children}
    </button>
  );
}
