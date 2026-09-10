import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SITE } from "../config";
import { posts, tools, writeups } from "../lib/content";

interface Line {
  type: "in" | "out" | "sys";
  text: string;
}

const HELP = `Available commands:

  help       this message
  whoami     operator identity
  ls         list sections
  articles   latest posts
  writeups   lab notes
  tools      public tooling
  tags       list tags
  about      short bio
  github     open GitHub
  pwd        working directory
  date       utc now
  id         fake posix id
  clear      reset the buffer
  echo       print arguments
`;

const WHOAMI = `barriuso
Security Researcher
Offensive Security · Pentesting · Red Team

"${SITE.tagline}"
`;

export function Terminal() {
  const navigate = useNavigate();
  const [lines, setLines] = useState<Line[]>([
    { type: "sys", text: `barriuso terminal — type "help". Commands are local fakes.` },
    { type: "out", text: HELP },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [lines]);

  function push(extra: Line[]) {
    setLines((prev) => [...prev, ...extra]);
  }

  function run(raw: string) {
    const input = raw.trim();
    if (!input) return;
    setHistory((h) => [input, ...h]);
    setHistIdx(-1);
    const [cmd, ...args] = input.split(/\s+/);
    const arg = args.join(" ");
    const echoIn: Line = { type: "in", text: input };

    switch (cmd) {
      case "help":
        push([echoIn, { type: "out", text: HELP }]);
        break;
      case "whoami":
        push([echoIn, { type: "out", text: WHOAMI }]);
        break;
      case "ls":
        push([
          echoIn,
          {
            type: "out",
            text: "articles/    writeups/    tools/    about.txt    github.url",
          },
        ]);
        break;
      case "pwd":
        push([echoIn, { type: "out", text: `/home/${SITE.name}` }]);
        break;
      case "date":
        push([echoIn, { type: "out", text: new Date().toUTCString() }]);
        break;
      case "id":
        push([echoIn, { type: "out", text: "uid=1000(barriuso) gid=1000(barriuso) groups=1000(barriuso),1337(offsec)" }]);
        break;
      case "uname":
        push([echoIn, { type: "out", text: "Linux lab 6.8.0-offsec #1 SMP x86_64 GNU/Linux" }]);
        break;
      case "echo":
        push([echoIn, { type: "out", text: arg || "" }]);
        break;
      case "clear":
        setLines([]);
        break;
      case "articles":
        push([
          echoIn,
          {
            type: "out",
            text: posts
              .slice(0, 6)
              .map((p) => `${p.date}  ${p.slug}`)
              .join("\n"),
          },
        ]);
        navigate("/articles");
        break;
      case "writeups":
        push([
          echoIn,
          {
            type: "out",
            text: writeups.map((p) => `${p.platform.padEnd(14)} ${p.slug}`).join("\n"),
          },
        ]);
        navigate("/writeups");
        break;
      case "tools":
        push([
          echoIn,
          {
            type: "out",
            text: tools.map((p) => `${p.language.padEnd(12)} ${p.title}`).join("\n"),
          },
        ]);
        navigate("/tools");
        break;
      case "about":
      case "cat":
        if (cmd === "cat" && arg && !/about/.test(arg)) {
          push([echoIn, { type: "out", text: `cat: ${arg}: No such file or directory` }]);
          break;
        }
        push([echoIn, { type: "out", text: WHOAMI }]);
        navigate("/about");
        break;
      case "github":
        push([echoIn, { type: "out", text: `opening ${SITE.github}` }]);
        window.open(SITE.github, "_blank", "noreferrer");
        break;
      case "tags":
        push([echoIn, { type: "sys", text: "→ /tags" }]);
        navigate("/tags");
        break;
      case "nmap":
      case "sudo":
      case "msfconsole":
        push([
          echoIn,
          {
            type: "out",
            text: `${cmd}: blocked. This is a decorative shell. Use an authorized lab.`,
          },
        ]);
        break;
      default:
        push([echoIn, { type: "out", text: `${SITE.shellName}: ${cmd}: command not found` }]);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    run(value);
    setValue("");
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      if (history[next]) {
        setHistIdx(next);
        setValue(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx - 1;
      if (next < 0) {
        setHistIdx(-1);
        setValue("");
      } else {
        setHistIdx(next);
        setValue(history[next] || "");
      }
    } else if (e.key === "c" && e.ctrlKey) {
      setValue("");
    }
  }

  return (
    <section
      className="overflow-hidden rounded-md border border-line bg-[#070707] shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
      aria-label="Interactive terminal"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center justify-between border-b border-white/8 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex gap-1" aria-hidden>
            <i className="block h-2.5 w-2.5 rounded-full bg-[#3d3d3d]" />
            <i className="block h-2.5 w-2.5 rounded-full bg-[#3d3d3d]" />
            <i className="block h-2.5 w-2.5 rounded-full bg-[#3d3d3d]" />
          </span>
          <span className="font-mono text-[11px] text-[#8a8a8a]">
            {SITE.promptUser}@{SITE.promptHost} — {SITE.shellName}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#5e5e5e]">session 0</span>
      </div>
      <div ref={outputRef} className="max-h-[380px] overflow-y-auto p-4 font-mono text-[12.5px] leading-relaxed text-[#d6d6d6]">
        {lines.map((l, i) => (
          <div key={i} className="mb-2 whitespace-pre-wrap">
            {l.type === "in" ? (
              <div>
                <Prompt />
                <span className="text-[#f3f3f3]">{l.text}</span>
              </div>
            ) : (
              <div className={l.type === "sys" ? "text-[#5e5e5e]" : "text-[#c8c8c8]"}>{l.text}</div>
            )}
          </div>
        ))}
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <Prompt />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            className="min-w-0 flex-1 bg-transparent font-mono text-[12.5px] text-[#f3f3f3] outline-none"
            aria-label="Terminal command"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </section>
  );
}

function Prompt() {
  return (
    <span className="mr-2 shrink-0 select-none">
      <span className="text-[#5e5e5e]">└─</span>
      <span className="text-[#00ff88]">$</span>
    </span>
  );
}
