export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  draft: boolean;
  sample: boolean;
  readingTime: number;
  content: string;
}

export interface Writeup extends Post {
  difficulty: "Easy" | "Medium" | "Hard" | "Insane";
  platform: string;
  os: string;
}

export interface Tool {
  slug: string;
  title: string;
  description: string;
  language: string;
  repo: string;
  stars: number;
  starsChecked?: string;
  tags: string[];
  featured: boolean;
  screenshot?: string;
  date: string;
  content: string;
}

export type SearchKind = "page" | "article" | "writeup" | "tool" | "tag" | "action";

export interface SearchItem {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle?: string;
  to?: string;
  href?: string;
  action?: "theme" | "search";
  tags?: string[];
}
