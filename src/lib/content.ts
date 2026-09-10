import type { Post, Tool, Writeup } from "../types";
import { asBool, asNumber, asString, asStringArray, parseFrontmatter } from "./frontmatter";
import { readingTime } from "./format";

const postFiles = import.meta.glob("../content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const writeupFiles = import.meta.glob("../content/writeups/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const toolFiles = import.meta.glob("../content/tools/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function slugFromPath(path: string): string {
  const file = path.split("/").pop() || "";
  return file.replace(/\.mdx?$/, "");
}

function byDateDesc<T extends { date: string }>(a: T, b: T) {
  return b.date.localeCompare(a.date);
}

function parsePost(path: string, raw: string): Post {
  const { data, content } = parseFrontmatter(raw);
  return {
    slug: slugFromPath(path),
    title: asString(data.title, slugFromPath(path)),
    description: asString(data.description),
    date: asString(data.date, "2026-01-01"),
    author: asString(data.author, "barriuso"),
    tags: asStringArray(data.tags),
    category: asString(data.category, "Notes"),
    draft: asBool(data.draft, false),
    sample: asBool(data.sample, false),
    readingTime: readingTime(content),
    content,
  };
}

function parseWriteup(path: string, raw: string): Writeup {
  const post = parsePost(path, raw);
  const { data } = parseFrontmatter(raw);
  const diff = asString(data.difficulty, "Medium");
  const difficulty = (["Easy", "Medium", "Hard", "Insane"].includes(diff)
    ? diff
    : "Medium") as Writeup["difficulty"];
  return {
    ...post,
    difficulty,
    platform: asString(data.platform, "Lab"),
    os: asString(data.os, "Linux"),
  };
}

function parseTool(path: string, raw: string): Tool {
  const { data, content } = parseFrontmatter(raw);
  return {
    slug: slugFromPath(path),
    title: asString(data.title, slugFromPath(path)),
    description: asString(data.description),
    language: asString(data.language, "Python"),
    repo: asString(data.repo),
    stars: asNumber(data.stars, 0),
    starsChecked: asString(data.starsChecked) || undefined,
    tags: asStringArray(data.tags),
    featured: asBool(data.featured, false),
    screenshot: asString(data.screenshot) || undefined,
    date: asString(data.date, "2026-01-01"),
    content,
  };
}

export const posts: Post[] = Object.entries(postFiles)
  .map(([path, raw]) => parsePost(path, raw))
  .filter((p) => !p.draft)
  .sort(byDateDesc);

export const writeups: Writeup[] = Object.entries(writeupFiles)
  .map(([path, raw]) => parseWriteup(path, raw))
  .filter((p) => !p.draft)
  .sort(byDateDesc);

export const tools: Tool[] = Object.entries(toolFiles)
  .map(([path, raw]) => parseTool(path, raw))
  .sort(byDateDesc);

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
export function getWriteup(slug: string) {
  return writeups.find((p) => p.slug === slug);
}
export function getTool(slug: string) {
  return tools.find((p) => p.slug === slug);
}

export function allTags(): string[] {
  const set = new Set<string>();
  for (const p of posts) p.tags.forEach((t) => set.add(t));
  for (const p of writeups) p.tags.forEach((t) => set.add(t));
  for (const p of tools) p.tags.forEach((t) => set.add(t));
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function contentByTag(tag: string) {
  const needle = tag.toLowerCase();
  const match = (tags: string[]) => tags.some((t) => t.toLowerCase() === needle);
  return {
    posts: posts.filter((p) => match(p.tags)),
    writeups: writeups.filter((p) => match(p.tags)),
    tools: tools.filter((p) => match(p.tags)),
  };
}

export function relatedPosts(post: Post, limit = 3): Post[] {
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score: p.tags.filter((t) => post.tags.includes(t)).length + (p.category === post.category ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date))
    .slice(0, limit)
    .map((x) => x.p);
}

export const categories = [...new Set(posts.map((p) => p.category))].sort();
