import React, { useState } from 'react';
import {
  Copy, Check, Sigma, BookOpen, Lightbulb, Info, AlertTriangle,
  Code2, Terminal, MessageCircleQuestion, Target, GraduationCap,
  Bookmark, ExternalLink, Clock, RefreshCw, CheckCircle2, List
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { MathRenderer } from './MathRenderer';

interface MarkdownRendererProps { content: string; }

// ─── Math Token Types ──────────────────────────────────────────────────────────
type MathToken =
  | { type: 'cmd'; value: string }      // value = command name WITHOUT backslash, e.g. 'frac'
  | { type: 'group'; children: MathToken[] }
  | { type: 'char'; value: string };

// ─── Tokenizer ─────────────────────────────────────────────────────────────────
function tokenize(src: string): MathToken[] {
  const tokens: MathToken[] = [];
  let i = 0;
  while (i < src.length) {
    if (src[i] === '\\') {
      // Backslash — read command name (letters) or single special char
      let name = '';
      i++;
      if (i < src.length && /[a-zA-Z]/.test(src[i])) {
        while (i < src.length && /[a-zA-Z]/.test(src[i])) name += src[i++];
        // Skip optional trailing space after word commands
        if (i < src.length && src[i] === ' ') i++;
      } else if (i < src.length) {
        name = src[i++]; // single non-alpha char like | { }
      }
      tokens.push({ type: 'cmd', value: name }); // name has NO leading backslash
    } else if (src[i] === '{') {
      let depth = 1; i++;
      const start = i;
      while (i < src.length && depth > 0) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}') depth--;
        i++;
      }
      tokens.push({ type: 'group', children: tokenize(src.slice(start, i - 1)) });
    } else {
      tokens.push({ type: 'char', value: src[i++] });
    }
  }
  return tokens;
}

// ─── Token Renderer ────────────────────────────────────────────────────────────
function renderTokens(tokens: MathToken[], key = '', isDisplay = false): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  const RED = '#FF4D4D';

  const nextGroup = (): MathToken[] => {
    while (i < tokens.length && tokens[i].type === 'char' && (tokens[i] as { type:'char';value:string }).value === ' ') i++;
    if (i < tokens.length && tokens[i].type === 'group')
      return (tokens[i++] as { type:'group'; children:MathToken[] }).children;
    if (i < tokens.length) return [tokens[i++]];
    return [];
  };

  while (i < tokens.length) {
    const tok = tokens[i];

    // ── Commands ──────────────────────────────────────────────────────────────
    if (tok.type === 'cmd') {
      i++;
      const cmd = tok.value; // e.g. 'frac', 'in', 'mathbb' — no backslash

      if (cmd === 'frac') {
        const num = nextGroup();
        const den = nextGroup();
        nodes.push(
          <span key={key+'-fr-'+i} style={{display:'inline-flex',flexDirection:'column',alignItems:'center',verticalAlign:'middle',margin:'0 4px',lineHeight:1.15,minWidth:0}}>
            <span style={{borderBottom:'1.5px solid '+RED,paddingBottom:'2px',paddingLeft:'4px',paddingRight:'4px',display:'flex',justifyContent:'center',minWidth:0}}>{renderTokens(num,key+'-n-'+i,isDisplay)}</span>
            <span style={{paddingTop:'2px',paddingLeft:'4px',paddingRight:'4px',display:'flex',justifyContent:'center',minWidth:0}}>{renderTokens(den,key+'-d-'+i,isDisplay)}</span>
          </span>
        );
        continue;
      }
      if (cmd === 'sum') { nodes.push(<span key={key+'-sm-'+i} style={{fontSize:'1.4em',verticalAlign:'middle',margin:'0 2px'}}>{'Σ'}</span>); continue; }
      if (cmd === 'prod') { nodes.push(<span key={key+'-pr-'+i} style={{fontSize:'1.4em',verticalAlign:'middle',margin:'0 2px'}}>{'∏'}</span>); continue; }
      if (cmd === 'int') { nodes.push(<span key={key+'-in2-'+i} style={{fontSize:'1.4em',verticalAlign:'middle',margin:'0 2px'}}>{'∫'}</span>); continue; }
      if (cmd === 'sqrt') {
        const arg = nextGroup();
        nodes.push(
          <span key={key+'-sq-'+i} style={{display:'inline-flex',alignItems:'flex-end',gap:'1px',verticalAlign:'middle'}}>
            <span style={{fontSize:'1.2em',lineHeight:1}}>{'√'}</span>
            <span style={{borderTop:'1.5px solid '+RED,paddingLeft:'1px',paddingRight:'3px'}}>{renderTokens(arg,key+'-sqa-'+i)}</span>
          </span>
        );
        continue;
      }
      if (cmd === 'mathbb') {
        const g = nextGroup();
        const letter = g.map(t => t.type==='char' ? (t as {type:'char';value:string}).value : '').join('');
        const bb: Record<string,string> = {R:'ℝ',N:'ℕ',Z:'ℤ',Q:'ℚ',C:'ℂ'};
        nodes.push(<span key={key+'-bb-'+i} style={{fontFamily:'Georgia,serif',fontStyle:'normal',fontWeight:700}}>{bb[letter]??letter}</span>);
        continue;
      }
      if (cmd === 'mathbf' || cmd === 'boldsymbol' || cmd === 'bm') {
        const g = nextGroup();
        nodes.push(<strong key={key+'-bf-'+i} style={{fontWeight:700,fontStyle:'normal'}}>{renderTokens(g,key+'-bfg-'+i)}</strong>);
        continue;
      }
      if (cmd === 'hat') {
        const g = nextGroup();
        nodes.push(
          <span key={key+'-ht-'+i} style={{display:'inline-block',position:'relative',paddingTop:'0.6em'}}>
            <span style={{position:'absolute',top:0,left:0,right:0,textAlign:'center',fontSize:'0.65em',lineHeight:1,fontStyle:'normal'}}>^</span>
            {renderTokens(g,key+'-htg-'+i)}
          </span>
        );
        continue;
      }
      if (cmd === 'bar' || cmd === 'overline') {
        const g = nextGroup();
        nodes.push(<span key={key+'-br-'+i} style={{display:'inline-block',borderTop:'1.5px solid '+RED,paddingTop:'1px'}}>{renderTokens(g,key+'-brg-'+i)}</span>);
        continue;
      }
      if (cmd === 'vec') {
        const g = nextGroup();
        nodes.push(
          <span key={key+'-vc-'+i} style={{display:'inline-block',position:'relative',paddingTop:'0.55em'}}>
            <span style={{position:'absolute',top:0,left:0,right:0,textAlign:'center',fontSize:'0.65em',lineHeight:1}}>{'→'}</span>
            {renderTokens(g,key+'-vcg-'+i)}
          </span>
        );
        continue;
      }
      if (cmd === 'left' || cmd === 'right' || cmd === 'big' || cmd === 'Big' || cmd === 'bigg' || cmd === 'Bigg') { continue; }
      if (cmd === 'text' || cmd === 'mathrm' || cmd === 'textrm' || cmd === 'mbox') {
        const g = nextGroup();
        nodes.push(<span key={key+'-tx-'+i} style={{fontFamily:'inherit',fontStyle:'normal',fontWeight:400}}>{renderTokens(g,key+'-txg-'+i)}</span>);
        continue;
      }
      if (cmd === 'textcolor') { nextGroup(); const g = nextGroup(); nodes.push(<span key={key+'-tc-'+i}>{renderTokens(g,key+'-tcg-'+i)}</span>); continue; }
      if (cmd === 'nabla') { nodes.push(<span key={key+'-nb-'+i}>{'∇'}</span>); continue; }
      if (cmd === 'partial') { nodes.push(<span key={key+'-pa-'+i}>{'∂'}</span>); continue; }
      if (cmd === 'infty') { nodes.push(<span key={key+'-if-'+i}>{'∞'}</span>); continue; }
      if (cmd === 'forall') { nodes.push(<span key={key+'-fa-'+i}>{'∀'}</span>); continue; }
      if (cmd === 'exists') { nodes.push(<span key={key+'-ex-'+i}>{'∃'}</span>); continue; }
      if (cmd === 'quad') { nodes.push(<span key={key+'-qd-'+i}>&ensp;&ensp;</span>); continue; }
      if (cmd === ',') { nodes.push(<span key={key+'-ts-'+i} style={{marginRight:'2px'}} />); continue; }
      if (cmd === '!') { continue; }
      if (cmd === ';') { nodes.push(<span key={key+'-ms-'+i}>&ensp;</span>); continue; }
      if (cmd === '\\') { nodes.push(<br key={key+'-b-'+i} />); continue; }

      // Matrix environments: \begin{bmatrix} ... \end{bmatrix}, matrix, pmatrix, etc.
      if (cmd === 'begin') {
        const envGroup = nextGroup();
        const envName = envGroup
          .map(t => (t.type === 'char' ? t.value : ''))
          .join('')
          .trim();

        // Collect tokens until matching \end{envName}
        const bodyTokens: MathToken[] = [];
        while (i < tokens.length) {
          const t = tokens[i];
          if (t.type === 'cmd' && t.value === 'end') {
            i++; // skip 'end'
            nextGroup(); // skip {envName}
            break;
          }
          bodyTokens.push(tokens[i++]);
        }

        // Split body into rows by '\\' command
        const rows: MathToken[][] = [[]];
        for (const bt of bodyTokens) {
          if (bt.type === 'cmd' && bt.value === '\\') {
            rows.push([]);
          } else {
            rows[rows.length - 1].push(bt);
          }
        }

        // Split each row into cells by '&' character
        const matrixGrid = rows
          .filter(r => r.length > 0)
          .map(r => {
            const cells: MathToken[][] = [[]];
            for (const ct of r) {
              if (ct.type === 'char' && ct.value === '&') {
                cells.push([]);
              } else {
                cells[cells.length - 1].push(ct);
              }
            }
            return cells;
          });

        const isBracket = envName === 'bmatrix';
        const isParen = envName === 'pmatrix';

        nodes.push(
          <span
            key={key + '-mat-' + i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              verticalAlign: 'middle',
              margin: '0 4px',
              borderLeft: isBracket ? '2px solid currentColor' : isParen ? '1.5px solid currentColor' : 'none',
              borderRight: isBracket ? '2px solid currentColor' : isParen ? '1.5px solid currentColor' : 'none',
              borderRadius: isBracket ? '2px' : isParen ? '6px' : '0',
              padding: '2px 6px',
              minWidth: 0,
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            <table style={{ borderCollapse: 'collapse', textAlign: 'center', borderSpacing: 0, margin: 0, fontSize: '0.95em' }}>
              <tbody>
                {matrixGrid.map((rowCells, rIdx) => (
                  <tr key={key + '-mr-' + rIdx}>
                    {rowCells.map((cellTokens, cIdx) => (
                      <td
                        key={key + '-mc-' + rIdx + '-' + cIdx}
                        style={{
                          padding: '2px 6px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          whiteSpace: 'nowrap',
                          border: 'none',
                          background: 'transparent',
                          minWidth: 0,
                        }}
                      >
                        {renderTokens(cellTokens, `${key}-mcell-${rIdx}-${cIdx}`, isDisplay)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </span>
        );
        continue;
      }

      // Greek letters — plain string keys, no backslash
      const greek: Record<string,string> = {
        alpha:'α', beta:'β', gamma:'γ', delta:'δ',
        epsilon:'ε', varepsilon:'ε', zeta:'ζ', eta:'η',
        theta:'θ', vartheta:'ϑ', iota:'ι', kappa:'κ',
        lambda:'λ', mu:'μ', nu:'ν', xi:'ξ',
        pi:'π', varpi:'ϖ', rho:'ρ', varrho:'ϱ',
        sigma:'σ', varsigma:'ς', tau:'τ', upsilon:'υ',
        phi:'φ', varphi:'φ', chi:'χ', psi:'ψ', omega:'ω',
        Gamma:'Γ', Delta:'Δ', Theta:'Θ', Lambda:'Λ',
        Xi:'Ξ', Pi:'Π', Sigma:'Σ', Phi:'Φ', Psi:'Ψ', Omega:'Ω',
      };
      if (greek[cmd]) { nodes.push(<span key={key+'-gr-'+i}>{greek[cmd]}</span>); continue; }

      // Relation / operator symbols — plain string keys
      const syms: Record<string,string> = {
        in:' ∈ ', notin:' ∉ ', subset:' ⊂ ', supset:' ⊃ ',
        cup:' ∪ ', cap:' ∩ ', times:' × ', cdot:' · ',
        pm:' ± ', mp:' ∓ ',
        leq:' ≤ ', geq:' ≥ ', le:' ≤ ', ge:' ≥ ',
        neq:' ≠ ', ne:' ≠ ', approx:' ≈ ', equiv:' ≡ ', sim:' ∼ ',
        to:' → ', rightarrow:' → ', leftarrow:' ← ',
        Rightarrow:' ⇒ ', Leftarrow:' ⇐ ', Leftrightarrow:' ⟺ ', iff:' ⟺ ',
        implies:' ⟹ ', Longrightarrow:' ⟹ ', Longleftarrow:' ⟸ ',
        longrightarrow:' ⟶ ', longleftarrow:' ⟵ ', Longleftrightarrow:' ⟺ ',
        therefore:' ∴ ', because:' ∵ ',
        mapsto:' ↦ ', longmapsto:' ⟼ ',
        land:' ∧ ', lor:' ∨ ', neg:'¬', lnot:'¬',
        propto:' ∝ ', perp:' ⊥ ', mid:'|',
        dots:'…', ldots:'…', cdots:'⋯', vdots:'⋮', ddots:'⋱',
        '|':'‖', '{':'{', '}':'}', '[':'', ']':'',
        langle:'⟨', rangle:'⟩',
        lfloor:'⌊', rfloor:'⌋', lceil:'⌈', rceil:'⌉',
      };

      if (syms[cmd] !== undefined) { nodes.push(<span key={key+'-sy-'+i}>{syms[cmd]}</span>); continue; }

      // Fallback: render command name as-is
      nodes.push(<span key={key+'-fb-'+i} style={{opacity:0.6}}>{cmd}</span>);
      continue;
    }

    // ── Groups ────────────────────────────────────────────────────────────────
    if (tok.type === 'group') {
      nodes.push(<span key={key+'-g-'+i}>{renderTokens(tok.children,key+'-gc-'+i)}</span>);
      i++; continue;
    }

    // ── Characters ───────────────────────────────────────────────────────────
    const ch = (tok as {type:'char';value:string}).value;
    i++;
    if (ch === '^') {
      const g = nextGroup();
      nodes.push(<sup key={key+'-sp-'+i} style={{fontSize:'0.75em',lineHeight:'1',verticalAlign:'super',fontStyle:'italic',marginLeft:'1px',marginRight:'1px'}}>{renderTokens(g,key+'-spg-'+i)}</sup>);
      continue;
    }
    if (ch === '_') {
      const g = nextGroup();
      nodes.push(<sub key={key+'-sb-'+i} style={{fontSize:'0.75em',lineHeight:'1',verticalAlign:'sub',fontStyle:'italic',marginLeft:'1px',marginRight:'1px'}}>{renderTokens(g,key+'-sbg-'+i)}</sub>);
      continue;
    }
    nodes.push(<span key={key+'-c-'+i}>{ch}</span>);
  }
  return <>{nodes}</>;
}

// ─── Public Math Formatter using KaTeX ────────────────────────────────────────
// Import MathRenderer component for proper math rendering
export const formatMath = (math: string, isDisplay = false): React.ReactNode => {
  return <MathRenderer math={math} display={isDisplay} />;
};

// ─── Formula Container ─────────────────────────────────────────────────────────
export const FormulaContainer: React.FC<{formula:string;centered?:boolean}> = ({formula,centered=true}) => (
  <div style={{margin:'16px 0',borderRadius:'12px',border:'1px solid #fecaca',borderLeft:'4px solid #FF4D4D',background:'#fff',padding:'14px 20px',boxShadow:'0 2px 8px rgba(255,77,77,0.06)',overflowX:'auto',maxWidth:'100%',width:'100%',display:'flex',justifyContent:centered?'center':'flex-start',alignItems:'center'}}>
    <div style={{color:'#FF4D4D',minWidth:'min-content'}}>
      <MathRenderer math={formula} display={true} />
    </div>
  </div>
);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ─── Markdown Renderer ─────────────────────────────────────────────────────────
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({content}) => {
  const [copiedIndex, setCopiedIndex] = useState<number|null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderInline = (text: string): React.ReactNode => {
    // Single-pass tokenizer: matches spans left-to-right in priority order.
    // Handles `code`, **bold**, $math$, \(math\), *italic*, [links]() correctly
    // Updated to support both $...$ and \(...\) LaTeX delimiters
    // Match \( followed by anything (including newlines) up to \) using [\s\S]
    const TOKEN_RE = /(`[^`\n]+`)|(\*\*(?:[^*]|\*(?!\*))+?\*\*)|(\\\([\s\S]+?\\\))|(\$[^$\n]+\$)|((?<![*\w])\*(?!\*)([^*\n]+)\*(?!\*))|\[([^\]]+)\]\(([^)]+)\)/g;

    const nodes: React.ReactNode[] = [];
    let last = 0;
    let m: RegExpExecArray | null;

    while ((m = TOKEN_RE.exec(text)) !== null) {
      // Push any plain text before this match
      if (m.index > last) nodes.push(text.slice(last, m.index));
      last = m.index + m[0].length;

      const [full, code, bold, mathParens, mathDollar, italic, , linkText, linkHref] = m;

      if (code) {
        // Inline code — render the inner content, recursing for any bold/math inside
        const inner = code.slice(1, -1);
        nodes.push(
          <code
            key={'c-' + m.index}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 text-sky-700 font-mono text-[13px] border border-slate-200/60"
          >
            {inner}
          </code>
        );
      } else if (bold) {
        // Bold **...** — recurse into inner content (may itself contain `code` or $math$)
        const inner = bold.slice(2, -2).trim();
        nodes.push(
          <strong key={'b-' + m.index} className="font-bold text-slate-900">
            {renderInline(inner)}
          </strong>
        );
      } else if (mathParens) {
        // Inline math \(...\)  using KaTeX
        // The captured group includes the delimiters: \(content\)
        // Remove opening \( and closing \) delimiters
        let mathContent = mathParens;
        if (mathContent.startsWith('\\(') && mathContent.endsWith('\\)')) {
          mathContent = mathContent.slice(2, -2);
        }
        
        // Handle escaped backslashes: \\text becomes \text
        mathContent = mathContent.replace(/\\\\/g, '\\');
        
        nodes.push(
          <span key={'m-' + m.index} style={{display:'inline'}}>
            <MathRenderer math={mathContent} display={false} />
          </span>
        );
      } else if (mathDollar) {
        // Inline math $...$  using KaTeX
        nodes.push(
          <span key={'m-' + m.index} style={{display:'inline'}}>
            <MathRenderer math={mathDollar.slice(1, -1)} display={false} />
          </span>
        );
      } else if (italic) {
        // Italic *...* (already boundary-checked by regex lookaround)
        const inner = m[5];
        nodes.push(
          <em key={'i-' + m.index} className="italic font-medium text-slate-800">
            {inner}
          </em>
        );
      } else if (linkText && linkHref) {
        // [text](url)
        nodes.push(
          <a
            key={'l-' + m.index}
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:text-sky-800 underline font-medium"
          >
            {linkText}
          </a>
        );
      } else {
        nodes.push(full);
      }
    }

    // Trailing plain text after the last match
    if (last < text.length) nodes.push(text.slice(last));

    return <>{nodes}</>;
  };


  const renderBlocks = () => {
    const lines = content.split('\n');
    const nodes: React.ReactNode[] = [];
    let i = 0, cbi = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks
      if (line.trim().startsWith('```')) {
        const lang = line.trim().slice(3).trim() || 'code';
        const cl: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) { cl.push(lines[i]); i++; }
        i++;
        const code = cl.join('\n');
        nodes.push(
          <CodeBlock
            key={'code-' + i}
            code={code}
            language={lang}
          />
        );
        continue;
      }

      // Display math $$ ... $$ or \[ ... \]
      if (line.trim().startsWith('$$') || line.trim().startsWith('\\[')) {
        const isBr = line.trim().startsWith('\\[');
        let mathText = line.trim().slice(2);
        const end = isBr ? '\\]' : '$$';
        if (mathText.endsWith(end) && mathText.length >= 2) {
          nodes.push(<FormulaContainer key={'fm-'+i} formula={mathText.slice(0,-2)} />);
          i++; continue;
        }
        const ml: string[] = [mathText]; i++;
        while (i < lines.length && !lines[i].trim().endsWith(end)) { ml.push(lines[i]); i++; }
        if (i < lines.length) { ml.push(lines[i].slice(0, -end.length)); i++; }
        nodes.push(<FormulaContainer key={'fm-'+i} formula={ml.join(' ')} />);
        continue;
      }

      // Headings
      if (line.startsWith('# ')) {
        const text = line.slice(2).trim();
        const slug = slugify(text);
        nodes.push(<h1 key={'h1-'+i} id={slug} data-anchor={slug} className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-8 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2.5 scroll-mt-24 break-words"><BookOpen className="w-6 h-6 text-sky-600 shrink-0"/><span>{renderInline(text)}</span></h1>);
        i++; continue;
      }
      if (line.startsWith('## ')) {
        const t = line.slice(3).trim();
        const slug = slugify(t);
        let Icon = BookOpen;
        if (/Prerequisites/i.test(t)) Icon = Lightbulb;
        else if (/Part 1|Python Fundamentals/i.test(t)) Icon = Code2;
        else if (/Part 2|NumPy Foundations/i.test(t)) Icon = Terminal;
        else if (/Part 3|Core NumPy/i.test(t)) Icon = Terminal;
        else if (/Part 4|Linear Algebra/i.test(t)) Icon = Sigma;
        else if (/Part 5|Applied to Machine|Applied to ML/i.test(t)) Icon = Sigma;
        else if (/Part 6|Practical|Projects/i.test(t)) Icon = Terminal;
        else if (/Part 7|Interview|Placement/i.test(t)) Icon = Target;
        else if (/Part 8|Revision|Cheat/i.test(t)) Icon = RefreshCw;
        else if (/Table of Contents/i.test(t)) Icon = List;
        nodes.push(<h2 key={'h2-'+i} id={slug} data-anchor={slug} className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2.5 scroll-mt-24 break-words"><Icon className="w-5 h-5 text-sky-600 shrink-0"/><span>{renderInline(t)}</span></h2>);
        i++; continue;
      }
      if (line.startsWith('### ')) {
        const text = line.slice(4).trim();
        const slug = slugify(text);
        nodes.push(<h3 key={'h3-'+i} id={slug} data-anchor={slug} className="text-lg font-bold text-slate-800 mt-6 mb-2.5 scroll-mt-24 break-words">{renderInline(text)}</h3>);
        i++; continue;
      }
      if (line.startsWith('#### ')) {
        const st = line.slice(5).trim();
        const slug = slugify(st);
        nodes.push(<h4 key={'h4-'+i} id={slug} data-anchor={slug} className="text-base font-semibold text-slate-800 mt-5 mb-2 flex items-center gap-2 scroll-mt-24 break-words">{/Challenge/i.test(st)&&<MessageCircleQuestion className="w-4 h-4 text-sky-600 shrink-0"/>}<span>{renderInline(st)}</span></h4>);
        i++; continue;
      }
      if (line.startsWith('##### ')) {
        const st = line.slice(6).trim();
        const slug = slugify(st);
        const isQuestion = /^Q\d*[:.]/i.test(st);
        nodes.push(
          <h5
            key={'h5-'+i}
            id={slug}
            data-anchor={slug}
            className={`text-sm sm:text-base font-bold mt-4 mb-2 scroll-mt-24 break-words flex items-start gap-2 ${
              isQuestion
                ? 'text-sky-900 bg-sky-50/80 border border-sky-200/80 px-3.5 py-2 rounded-lg'
                : 'text-slate-800'
            }`}
          >
            {isQuestion && <MessageCircleQuestion className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />}
            <span>{renderInline(st)}</span>
          </h5>
        );
        i++; continue;
      }
      if (line.startsWith('###### ')) {
        const st = line.slice(7).trim();
        const slug = slugify(st);
        nodes.push(<h6 key={'h6-'+i} id={slug} data-anchor={slug} className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mt-3 mb-1.5 scroll-mt-24 break-words">{renderInline(st)}</h6>);
        i++; continue;
      }

      // HR
      if (line.trim()==='---'||line.trim()==='***') { nodes.push(<hr key={'hr-'+i} className="my-6 border-slate-200"/>); i++; continue; }

      // Blockquotes / Callouts
      if (line.startsWith('>')) {
        const rawLines: string[] = [];
        while (i < lines.length && lines[i].startsWith('>')) {
          rawLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }

        // Determine callout alert type from first line or combined text
        const firstLine = rawLines[0] || '';
        let type: 'warning' | 'caution' | 'tip' | 'important' | 'advanced' | 'note' = 'note';
        let alertTitle = '';

        if (/\[!WARNING\]/i.test(firstLine) || /Warning:|Danger:|Trap:/i.test(firstLine)) {
          type = 'warning';
          alertTitle = 'Warning';
        } else if (/\[!CAUTION\]/i.test(firstLine) || /Caution:/i.test(firstLine)) {
          type = 'caution';
          alertTitle = 'Caution';
        } else if (/\[!TIP\]/i.test(firstLine) || /Interview Tip:|Placement Tip:/i.test(firstLine)) {
          type = 'tip';
          alertTitle = 'Pro Tip';
        } else if (/\[!IMPORTANT\]/i.test(firstLine) || /Key Takeaway:|Remember:/i.test(firstLine)) {
          type = 'important';
          alertTitle = 'Important Note';
        } else if (/Advanced:/i.test(firstLine)) {
          type = 'advanced';
          alertTitle = 'Advanced Concept';
        }

        // Filter out raw alert marker lines like "[!IMPORTANT]" or "[!WARNING]"
        const cleanedLines = rawLines.map(l =>
          l.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, '').trim()
        ).filter((l, idx) => l.length > 0 || idx > 0);

        const typeStyles = {
          warning: { icon: AlertTriangle, bc: 'border-amber-500', bg: 'bg-amber-50/80', ic: 'text-amber-600', tc: 'text-amber-900' },
          caution: { icon: AlertTriangle, bc: 'border-rose-500', bg: 'bg-rose-50/80', ic: 'text-rose-600', tc: 'text-rose-900' },
          tip: { icon: Target, bc: 'border-emerald-500', bg: 'bg-emerald-50/80', ic: 'text-emerald-600', tc: 'text-emerald-900' },
          important: { icon: Bookmark, bc: 'border-indigo-500', bg: 'bg-indigo-50/80', ic: 'text-indigo-600', tc: 'text-indigo-900' },
          advanced: { icon: GraduationCap, bc: 'border-purple-500', bg: 'bg-purple-50/80', ic: 'text-purple-600', tc: 'text-purple-900' },
          note: { icon: Info, bc: 'border-sky-500', bg: 'bg-sky-50/80', ic: 'text-sky-600', tc: 'text-sky-900' },
        }[type];

        const CIcon = typeStyles.icon;

        nodes.push(
          <div
            key={'q-' + i}
            className={`my-5 border-l-4 ${typeStyles.bc} ${typeStyles.bg} p-4 rounded-r-xl text-slate-800 text-sm shadow-xs`}
          >
            <div className="flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider">
              <CIcon className={`w-4 h-4 ${typeStyles.ic} shrink-0`} />
              <span className={typeStyles.tc}>{alertTitle || 'Note'}</span>
            </div>
            <div className="space-y-1.5 pl-6">
              {cleanedLines.map((l, qi) => (
                <p key={qi} className="leading-relaxed">
                  {renderInline(l)}
                </p>
              ))}
            </div>
          </div>
        );
        continue;
      }

      // Tables
      if (line.trim().startsWith('|') && line.includes('|')) {
        const tl: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) { tl.push(lines[i].trim()); i++; }
        if (tl.length >= 2) {
          const parseRow = (r: string) => {
            let trimmed = r.trim();
            if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
            if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
            const cells: string[] = [];
            let current = '';
            let inCode = false;
            for (let cIdx = 0; cIdx < trimmed.length; cIdx++) {
              const ch = trimmed[cIdx];
              if (ch === '`') {
                inCode = !inCode;
                current += ch;
              } else if (ch === '\\' && cIdx + 1 < trimmed.length && trimmed[cIdx + 1] === '|') {
                current += '|';
                cIdx++;
              } else if (ch === '|' && !inCode) {
                cells.push(current.trim());
                current = '';
              } else {
                current += ch;
              }
            }
            cells.push(current.trim());
            return cells;
          };
          const hdrs = parseRow(tl[0]), rows = tl.slice(2).map(parseRow);
          nodes.push(
            <div key={'tb-'+i} className="my-5 overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
              <table className="w-full text-left text-sm border-collapse">
                <thead><tr className="bg-slate-100/90 border-b border-slate-200 text-slate-800">{hdrs.map((h,hi)=><th key={hi} className="px-4 py-3 font-bold whitespace-normal text-left">{renderInline(h)}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-100 bg-white">{rows.map((r,ri)=><tr key={ri} className="hover:bg-slate-50/80 transition-colors">{r.map((c,ci)=><td key={ci} className="px-4 py-3 text-slate-700 leading-relaxed font-normal text-sm">{renderInline(c)}</td>)}</tr>)}</tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      // Bullet / task lists
      if (line.trim().startsWith('- ')||line.trim().startsWith('* ')) {
        const items: {text:string;task:boolean;done:boolean}[] = [];
        while (i<lines.length&&(lines[i].trim().startsWith('- ')||lines[i].trim().startsWith('* '))) {
          const raw=lines[i].trim().slice(2);
          if (raw.startsWith('[x] ')||raw.startsWith('[X] ')) items.push({text:raw.slice(4),task:true,done:true});
          else if (raw.startsWith('[ ] ')) items.push({text:raw.slice(4),task:true,done:false});
          else items.push({text:raw,task:false,done:false});
          i++;
        }
        nodes.push(
          <ul key={'ul-'+i} className="my-3 space-y-2 text-slate-700 text-sm">
            {items.map((it,ii)=>it.task
              ? <li key={ii} className="flex items-start gap-2.5 list-none leading-relaxed"><span className="w-4 h-4 rounded mt-0.5 flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-300 shrink-0"><Check className="w-3 h-3 stroke-[3]"/></span><span>{renderInline(it.text)}</span></li>
              : <li key={ii} className="pl-1 list-disc ml-4 leading-relaxed">{renderInline(it.text)}</li>
            )}
          </ul>
        );
        continue;
      }

      // Numbered lists
      if (/^d+.s/.test(line.trim())) {
        const items: string[] = [];
        while (i<lines.length&&/^d+.s/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^d+.s/,'')); i++; }
        nodes.push(<ol key={'ol-'+i} className="my-3 space-y-1.5 pl-5 list-decimal text-slate-700 text-sm">{items.map((it,ii)=><li key={ii} className="leading-relaxed">{renderInline(it)}</li>)}</ol>);
        continue;
      }

      // Paragraph (with enhanced Answer/Output label styling)
      if (line.trim().length > 0) {
        const trimmed = line.trim();
        if (trimmed === '**Answer:**' || trimmed === '**Answer:** ') {
          nodes.push(
            <div key={'ans-lbl-'+i} className="mt-3 mb-1.5 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                Answer
              </span>
            </div>
          );
          i++;
          continue;
        }
        nodes.push(<p key={'p-'+i} className="my-2.5 text-slate-700 text-sm leading-relaxed break-words">{renderInline(line)}</p>);
      }
      i++;
    }
    return nodes;
  };

  return (
    <div className="markdown-render notes-content notes-handwritten-scope space-y-1 select-text w-full max-w-full min-w-0 break-words">
      {renderBlocks()}
    </div>
  );
};
