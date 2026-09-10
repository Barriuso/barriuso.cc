import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { CommandPalette } from "./CommandPalette";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch((v) => !v);
      }
      if (e.key === "Escape") setSearch(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-screen bg-bg text-fg">
      <div className="scanlines" aria-hidden />
      <div className="noise" aria-hidden />
      <a href="#content" className="skip-link" onClick={(event) => {
        event.preventDefault();
        const main = document.getElementById("content");
        main?.focus({ preventScroll: true });
        main?.scrollIntoView({ block: "start" });
      }}>
        Skip to content
      </a>
      <Header onSearch={() => setSearch(true)} />
      <div className="border-b border-line/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 overflow-hidden px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
          <span>// security research</span>
          <span className="hidden sm:inline">tun0 10.10.14.22</span>
          <span>0xDEADBEEF</span>
        </div>
      </div>
      <main id="content" tabIndex={-1}>{children}</main>
      <Footer />
      <CommandPalette open={search} onClose={() => setSearch(false)} />
    </div>
  );
}
