import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconSearch(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...props} {...base}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.5 16.5 21 21" />
    </svg>
  );
}

export function IconGithub(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...props} fill="currentColor" stroke="none">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.92-.63.07-.62.07-.62 1 .07 1.53 1.04 1.53 1.04.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.84c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function IconSun(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...props} {...base}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v1.6M12 19.4V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.6M19.4 12H21M4.9 19.1 6 18M18 6l1.1-1.1" />
    </svg>
  );
}

export function IconMoon(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...props} {...base}>
      <path d="M17.5 14.5A7 7 0 0 1 9.5 6.5 7 7 0 1 0 17.5 14.5Z" />
    </svg>
  );
}

export function IconMenu(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...props} {...base}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...props} {...base}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconArrow(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden {...props} {...base}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconRss(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden {...props} {...base}>
      <path d="M5 19a1.2 1.2 0 1 0 0.01 0Z" />
      <path d="M5 11a8 8 0 0 1 8 8" />
      <path d="M5 6a13 13 0 0 1 13 13" />
    </svg>
  );
}

export function IconCopy(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden {...props} {...base}>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M5 16V5h11" />
    </svg>
  );
}

export function IconCheck(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden {...props} {...base}>
      <path d="M5 12.5 10 17l9-10" />
    </svg>
  );
}

export function IconStar(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden {...props} fill="currentColor" stroke="none">
      <path d="M12 3.5 14.7 9l6 .9-4.4 4.3 1 5.9L12 17.8 6.7 20.1l1-5.9L3.3 9.9l6-.9L12 3.5Z" />
    </svg>
  );
}

export function IconMail(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...props} {...base}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function IconLinkedin(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...props} fill="currentColor" stroke="none">
      <path d="M6.5 9H4v11h2.5V9ZM5.25 4A1.75 1.75 0 1 0 5.25 7.5 1.75 1.75 0 0 0 5.25 4ZM20 20h-2.5v-5.6c0-1.56-.56-2.4-1.7-2.4-1.25 0-1.8.86-1.8 2.4V20H11.5V9h2.4v1.5c.5-.9 1.6-1.7 3.15-1.7 2.3 0 3.95 1.5 3.95 4.7V20Z" />
    </svg>
  );
}

export function IconExternal(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden {...props} {...base}>
      <path d="M14 5h5v5M19 5 10 14" />
      <path d="M17 13.5V18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4.5" />
    </svg>
  );
}
