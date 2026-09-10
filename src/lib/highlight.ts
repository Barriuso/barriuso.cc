const ESC: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ESC[c] || c);
}

type Rule = { cls: string; re: RegExp };

function apply(code: string, rules: Rule[]): string {
  const ranges: { start: number; end: number; cls: string }[] = [];
  for (const rule of rules) {
    const re = new RegExp(rule.re.source, rule.re.flags.includes("g") ? rule.re.flags : rule.re.flags + "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(code))) {
      const start = m.index;
      const end = start + m[0].length;
      if (ranges.some((r) => start < r.end && end > r.start)) continue;
      ranges.push({ start, end, cls: rule.cls });
    }
  }
  ranges.sort((a, b) => a.start - b.start);
  let out = "";
  let cursor = 0;
  for (const r of ranges) {
    if (r.start > cursor) out += escapeHtml(code.slice(cursor, r.start));
    out += `<span class="${r.cls}">${escapeHtml(code.slice(r.start, r.end))}</span>`;
    cursor = r.end;
  }
  out += escapeHtml(code.slice(cursor));
  return out;
}

const KW = (words: string) =>
  new RegExp(`\\b(?:${words})\\b`);

export function highlight(code: string, lang: string): string {
  const l = lang.toLowerCase();
  if (l === "json") {
    return apply(code, [
      { cls: "tok-cmt", re: /\/\/[^\n]*/ },
      { cls: "tok-str", re: /"(?:\\.|[^"\\])*"(?=\s*:)/ },
      { cls: "tok-str", re: /"(?:\\.|[^"\\])*"/ },
      { cls: "tok-num", re: /\b-?\d+(?:\.\d+)?\b/ },
      { cls: "tok-kw", re: /\b(?:true|false|null)\b/ },
    ]);
  }
  if (l === "yaml" || l === "yml") {
    return apply(code, [
      { cls: "tok-cmt", re: /#[^\n]*/ },
      { cls: "tok-str", re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
      { cls: "tok-key", re: /^[\t ]*[\w.-]+(?=\s*:)/m },
      { cls: "tok-num", re: /\b-?\d+(?:\.\d+)?\b/ },
    ]);
  }
  if (l === "python" || l === "py") {
    return apply(code, [
      { cls: "tok-cmt", re: /#[^\n]*/ },
      { cls: "tok-str", re: /"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
      { cls: "tok-kw", re: KW("def|class|return|import|from|as|if|elif|else|for|while|try|except|with|yield|lambda|pass|in|not|and|or|True|False|None|async|await") },
      { cls: "tok-num", re: /\b-?\d+(?:\.\d+)?\b/ },
    ]);
  }
  if (l === "javascript" || l === "js" || l === "ts" || l === "typescript") {
    return apply(code, [
      { cls: "tok-cmt", re: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
      { cls: "tok-str", re: /`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
      { cls: "tok-kw", re: KW("const|let|var|function|return|import|from|export|if|else|for|while|class|new|async|await|try|catch|throw|typeof|interface|type") },
      { cls: "tok-num", re: /\b-?\d+(?:\.\d+)?\b/ },
    ]);
  }
  if (l === "c" || l === "cpp" || l === "csharp" || l === "cs") {
    return apply(code, [
      { cls: "tok-cmt", re: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
      { cls: "tok-str", re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
      { cls: "tok-kw", re: KW("int|char|void|return|if|else|for|while|struct|class|public|private|static|const|new|using|namespace|bool|string|var") },
      { cls: "tok-num", re: /\b-?\d+(?:\.\d+)?[lLuU]*\b/ },
    ]);
  }
  if (l === "powershell" || l === "ps1") {
    return apply(code, [
      { cls: "tok-cmt", re: /#[^\n]*/ },
      { cls: "tok-str", re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
      { cls: "tok-kw", re: KW("function|param|if|else|foreach|for|while|return|switch|try|catch|\$true|\$false|\$null") },
      { cls: "tok-cmd", re: /\b(?:Get|Set|New|Remove|Invoke|Write|Select|Where|ForEach)-\w+\b/ },
      { cls: "tok-num", re: /\b-?\d+\b/ },
    ]);
  }
  if (["bash", "sh", "zsh", "shell", "console", "terminal"].includes(l)) {
    return apply(code, [
      { cls: "tok-cmt", re: /(?:^|\s)#[^\n]*/ },
      { cls: "tok-str", re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
      { cls: "tok-prompt", re: /^(?:\$|\#|PS>|┌──.*|└─\$)\s?/m },
      { cls: "tok-flag", re: /\s-{1,2}[A-Za-z0-9][\w-]*/ },
      { cls: "tok-path", re: /(?:~\/|\/)[\w./-]+/ },
      { cls: "tok-num", re: /\b\d+(?:\.\d+){3}(?:\/\d+)?\b|\b\d+\b/ },
    ]);
  }
  return escapeHtml(code);
}


