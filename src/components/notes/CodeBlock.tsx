import React, { useState, useMemo } from 'react';
import Prism from 'prismjs';
// Load common syntax highlighting languages
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import {
  Copy,
  Check,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronRight,
  Terminal,
  FileCode,
} from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  fileName?: string;
  highlightLines?: number[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const LANGUAGE_LABELS: Record<string, { name: string; fileExt: string; color: string }> = {
  python: { name: 'Python', fileExt: '.py', color: '#3b82f6' },
  py: { name: 'Python', fileExt: '.py', color: '#3b82f6' },
  cpp: { name: 'C++', fileExt: '.cpp', color: '#6366f1' },
  'c++': { name: 'C++', fileExt: '.cpp', color: '#6366f1' },
  c: { name: 'C', fileExt: '.c', color: '#64748b' },
  java: { name: 'Java', fileExt: '.java', color: '#f97316' },
  javascript: { name: 'JavaScript', fileExt: '.js', color: '#eab308' },
  js: { name: 'JavaScript', fileExt: '.js', color: '#eab308' },
  typescript: { name: 'TypeScript', fileExt: '.ts', color: '#38bdf8' },
  ts: { name: 'TypeScript', fileExt: '.ts', color: '#38bdf8' },
  sql: { name: 'SQL', fileExt: '.sql', color: '#06b6d4' },
  bash: { name: 'Bash', fileExt: '.sh', color: '#10b981' },
  sh: { name: 'Shell', fileExt: '.sh', color: '#10b981' },
  shell: { name: 'Shell', fileExt: '.sh', color: '#10b981' },
  json: { name: 'JSON', fileExt: '.json', color: '#eab308' },
  html: { name: 'HTML', fileExt: '.html', color: '#ef4444' },
  css: { name: 'CSS', fileExt: '.css', color: '#8b5cf6' },
};

function normalizeLang(lang: string = ''): string {
  const l = lang.trim().toLowerCase();
  if (l === 'py') return 'python';
  if (l === 'js') return 'javascript';
  if (l === 'ts') return 'typescript';
  if (l === 'c++') return 'cpp';
  if (l === 'sh' || l === 'shell') return 'bash';
  return l || 'plaintext';
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  fileName,
  highlightLines = [],
  collapsible = true,
  defaultExpanded = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const cleanCode = useMemo(() => code.replace(/\r\n/g, '\n').trimEnd(), [code]);
  const lines = useMemo(() => cleanCode.split('\n'), [cleanCode]);
  const lineCount = lines.length;

  const normLang = normalizeLang(language);
  const meta = LANGUAGE_LABELS[normLang] || {
    name: language ? language.toUpperCase() : 'CODE',
    fileExt: '',
    color: '#94a3b8',
  };

  const displayFileName = fileName || (meta.fileExt ? `main${meta.fileExt}` : undefined);

  // Auto-collapse long code blocks (> 45 lines) if collapsible and not explicitly set
  const isLengthy = lineCount > 40;

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Syntax highlighting using Prism
  const highlightedHtml = useMemo(() => {
    const prismLang = Prism.languages[normLang] || Prism.languages.plaintext || Prism.languages.text;
    if (prismLang) {
      try {
        return Prism.highlight(cleanCode, prismLang, normLang);
      } catch {
        // fallback
      }
    }
    return null;
  }, [cleanCode, normLang]);

  // Split highlighted HTML into lines for line numbers and line highlighting
  const highlightedLines = useMemo(() => {
    if (!highlightedHtml) return lines.map((l) => escapeHtml(l));
    return highlightedHtml.split('\n');
  }, [highlightedHtml, lines]);

  return (
    <div
      className={`my-6 rounded-xl overflow-hidden border border-[#1E293B]/90 shadow-2xl transition-all duration-200 ${
        isFullscreen
          ? 'fixed inset-4 z-50 flex flex-col bg-[#0D1117] my-0 rounded-2xl ring-1 ring-[#334155]/80 shadow-[0_20px_70px_rgba(0,0,0,0.85)]'
          : 'bg-[#0D1117]'
      }`}
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" }}
    >
      {/* IDE Window Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#161B22] border-b border-[#1E293B]/80 select-none text-xs">
        {/* Left: Window Controls + File / Language Tab */}
        <div className="flex items-center gap-3">
          {/* Mac/IDE dots */}
          <div className="flex items-center gap-1.5 opacity-75 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          </div>

          {/* Active Language Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0D1117] border border-[#1E293B] text-[#CBD5E1] shadow-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: meta.color }}
            />
            <span className="font-semibold text-[11px] text-[#E2E8F0]">
              {meta.name}
            </span>
          </div>

          {/* Line Count */}
          <span className="text-[11px] text-[#64748B] font-sans hidden sm:inline">
            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </span>
        </div>

        {/* Right: Actions (Collapse, Fullscreen, Copy) */}
        <div className="flex items-center gap-1.5 font-sans">
          {/* Collapse/Expand for lengthy blocks */}
          {collapsible && isLengthy && !isFullscreen && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
              title={isExpanded ? 'Collapse code' : 'Expand full code'}
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Collapse</span>
                </>
              ) : (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Expand ({lineCount} lines)</span>
                </>
              )}
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title={isFullscreen ? 'Exit full screen (Esc)' : 'Open in full screen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-150 ${
              copied
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      {(!collapsible || isExpanded || isFullscreen) ? (
        <div
          className={`relative overflow-auto ${
            isFullscreen ? 'flex-1 max-h-none' : 'max-h-[650px]'
          }`}
        >
          <pre
            className="p-0 m-0 text-[13px] leading-[1.65] bg-[#0D1117] text-[#E2E8F0] select-text"
            style={{ tabSize: 4 }}
          >
            <table className="w-full border-collapse">
              <tbody>
                {highlightedLines.map((lineHtml, idx) => {
                  const lineNum = idx + 1;
                  const isHighlighted = highlightLines.includes(lineNum);
                  return (
                    <tr
                      key={lineNum}
                      className={`group hover:bg-[#161B22]/70 transition-colors ${
                        isHighlighted ? 'bg-[#082F49]/40 border-l-2 border-[#38BDF8]' : ''
                      }`}
                    >
                      {/* Line Number */}
                      <td
                        className="py-0 px-3 select-none text-right text-[11.5px] text-[#475569] group-hover:text-[#94A3B8] font-mono tracking-tighter w-[1%] whitespace-nowrap align-top border-r border-[#1E293B]/60 bg-[#0D1117]"
                        style={{ userSelect: 'none' }}
                      >
                        {lineNum}
                      </td>

                      {/* Code Content */}
                      <td className="py-0 px-4 whitespace-pre font-mono overflow-x-auto text-[#E2E8F0]">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: lineHtml || '&nbsp;',
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </pre>
        </div>
      ) : (
        /* Collapsed Preview */
        <div
          onClick={() => setIsExpanded(true)}
          className="px-4 py-3 bg-[#0D1117] hover:bg-[#161B22] cursor-pointer text-xs text-[#94A3B8] flex items-center justify-between border-t border-[#1E293B]/40 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>
              Code collapsed ({lineCount} lines) — click to expand full implementation
            </span>
          </span>
          <span className="text-[11px] text-[#38BDF8] font-medium">Expand ↓</span>
        </div>
      )}
    </div>
  );
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
