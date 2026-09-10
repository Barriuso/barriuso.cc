import { useState } from "react";
import { highlight } from "../lib/highlight";
import { IconCheck, IconCopy } from "./Icons";

const TERM_LANGS = new Set(["bash", "sh", "zsh", "shell", "console", "terminal"]);

export function CodeBlock({
  code,
  lang,
  meta,
}: {
  code: string;
  lang: string;
  meta?: string;
}) {
  const [copied, setCopied] = useState(false);
  const filename = /(?:filename|file)=([^\s]+)/.exec(meta || "")?.[1];
  const isTerm = TERM_LANGS.has(lang.toLowerCase());

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="group my-5 overflow-hidden rounded-md border border-white/10 bg-[#0a0a0a] text-[#d6d6d6] shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
      {isTerm ? (
        <div className="flex items-center justify-between border-b border-white/8 px-3 py-2 font-mono text-[11px] text-[#8a8a8a]">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex gap-1" aria-hidden>
              <i className="block h-2 w-2 rounded-full bg-[#3a3a3a]" />
              <i className="block h-2 w-2 rounded-full bg-[#3a3a3a]" />
              <i className="block h-2 w-2 rounded-full bg-[#3a3a3a]" />
            </span>
            <span className="truncate text-[#9ad7a8]">
              ┌──[kali@lab]─[~/pentest]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wider text-[#5e5e5e]">{lang}</span>
            <CopyBtn copied={copied} onClick={copy} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-white/8 px-3 py-2 font-mono text-[11px] text-[#8a8a8a]">
          <span className="truncate">{filename || lang}</span>
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wider text-[#5e5e5e]">{lang}</span>
            <CopyBtn copied={copied} onClick={copy} />
          </div>
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed">
        <code
          className="font-mono"
          dangerouslySetInnerHTML={{ __html: highlight(code, lang) }}
        />
      </pre>
    </div>
  );
}

function CopyBtn({ copied, onClick }: { copied: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-sm border border-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-[#8a8a8a] hover:border-[#00ff88]/40 hover:text-[#00ff88]"
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? <IconCheck /> : <IconCopy />}
      {copied ? "copied" : "copy"}
    </button>
  );
}
