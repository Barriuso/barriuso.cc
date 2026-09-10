import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV, SITE } from "../config";
import { useTheme } from "./Theme";
import { IconClose, IconGithub, IconMenu, IconMoon, IconSearch, IconSun } from "./Icons";

export function Header({ onSearch }: { onSearch: () => void }) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="font-mono text-sm text-fg-bright" aria-label="Home">
          <span className="text-accent">./</span>
          {SITE.name}
        </Link>
        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `rounded-sm px-2.5 py-1 font-mono text-[12px] tracking-wide ${
                  isActive ? "text-accent" : "text-muted hover:text-fg-bright"
                }`
              }
            >
              {({ isActive }) => (
                <span>
                  {isActive ? "> " : ""}
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={onSearch}
            className="inline-flex items-center gap-2 rounded-sm border border-line px-2 py-1 text-muted hover:border-line-strong hover:text-fg-bright"
            aria-label="Open search"
          >
            <IconSearch />
            <span className="hidden font-mono text-[11px] sm:inline">Search</span>
            <kbd className="hidden sm:inline">Ctrl K</kbd>
          </button>
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-sm p-2 text-muted hover:text-fg-bright"
            aria-label="GitHub"
          >
            <IconGithub />
          </a>
          <button
            type="button"
            onClick={toggle}
            className="rounded-sm p-2 text-muted hover:text-fg-bright"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <IconSun /> : <IconMoon />}
          </button>
          <button
            type="button"
            className="rounded-sm p-2 text-muted md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line px-4 py-3 md:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-sm px-2 py-2 font-mono text-sm ${isActive ? "text-accent" : "text-fg"}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
