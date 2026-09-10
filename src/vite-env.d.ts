/// <reference types="vite/client" />

interface ImportMeta {
  glob: (
    pattern: string,
    options?: {
      query?: string;
      import?: string;
      eager?: boolean;
    },
  ) => Record<string, string>;
}

declare module "*.md?raw" {
  const src: string;
  export default src;
}

declare module "*.md" {
  const src: string;
  export default src;
}
