import deployment from "../site.config.json";

export const SITE = {
  name: "barriuso",
  promptUser: "barriuso",
  promptHost: "lab",
  shellName: "barriuso sh",
  title: "barriuso — Offensive Security Research",
  description:
    "Personal notes on pentesting, adversary simulation, and security research. Breaking things to understand how they work.",
  tagline: "Breaking things to understand how they work.",
  url: (import.meta.env.VITE_SITE_URL || deployment.url || new URL(import.meta.env.BASE_URL, window.location.origin).href).replace(/\/$/, ""),
  github: "https://github.com/Barriuso",
  author: "barriuso",
  year: 2026,
};

export function assetUrl(path: string) {
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/articles", label: "Articles" },
  { to: "/writeups", label: "Writeups" },
  { to: "/tools", label: "Tools" },
  { to: "/about", label: "About" },
] as const;
