import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Compass,
  CheckCircle2,
  Circle,
  Award,
  BookOpen,
  Code2,
  Cpu,
  Sigma,
  FolderGit2,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { globalProgressStore, useGlobalProgress } from '../../stores/globalProgressStore';

export interface FlowchartNode {
  id: string;
  sectionNumber: string;
  title: string;
  subtitle?: string;
  stage: 'START' | 'PREREQUISITES' | 'FUNDAMENTALS' | 'CORE' | 'APPLIED' | 'PRACTICAL' | 'INTERVIEW' | 'REVISION';
  targetAnchor: string;
  subtopics?: string[];
  keySkill?: string;
}

interface LearningFlowchartProps {
  topicId: string;
  topicTitle: string;
  markdownContent?: string;
  nodes?: FlowchartNode[];
  onSelectNode?: (anchor: string) => void;
}

// Hand-drawn pastel palette from reference
const PASTEL_PALETTE = [
  { fill: '#B6C94B', name: 'Lime Green', light: '#f4f7e6' },
  { fill: '#35C5C1', name: 'Turquoise', light: '#e6faf9' },
  { fill: '#68B7E8', name: 'Sky Blue', light: '#eaf4fc' },
  { fill: '#D77AB8', name: 'Pink', light: '#faeef6' },
  { fill: '#FFA33D', name: 'Orange', light: '#fff4e6' },
  { fill: '#F5D547', name: 'Yellow', light: '#fefbe8' },
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Single source of truth parser:
 * Automatically derives the flowchart directly from markdown headings.
 */
export function extractFlowchartFromMarkdown(markdown: string): FlowchartNode[] {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  // Lecture 1 uses numbered H2 main sections with H3 children. Lectures 2 and 3
  // use numbered H1 main sections with H2 children. Ignore headings in code.
  let inCodeBlock = false;
  const contentLines = lines.filter(line => {
    if (/^\s*```/.test(line)) { inCodeBlock = !inCodeBlock; return false; }
    return !inCodeBlock;
  });
  const mainHeadingLevel = contentLines.some(line => /^# \d+\.\s/.test(line.trim())) ? 1 : 2;
  const result: FlowchartNode[] = [];
  let currentSec: FlowchartNode | null = null;
  inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) { inCodeBlock = !inCodeBlock; continue; }
    if (inCodeBlock) continue;
    const line = lines[i].trim();
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading && heading[1].length === mainHeadingLevel) {
      const rawHeading = heading[2].trim();
      // Only numbered sections are flowchart main topics; skip document titles
      // such as "Lecture 2" and unnumbered intro headings.
      if (!/^\d+\.\s/.test(rawHeading)) continue;
      if (/learning objectives/i.test(rawHeading) || /table of contents/i.test(rawHeading)) {
        continue;
      }
      const slug = slugify(rawHeading);

      let stage: FlowchartNode['stage'] = 'CORE';
      if (/overview|start|why this matters/i.test(rawHeading)) stage = 'START';
      else if (/prerequisite|mindset/i.test(rawHeading)) stage = 'PREREQUISITES';
      else if (/fundamentals/i.test(rawHeading)) stage = 'FUNDAMENTALS';
      else if (/architecture|core operations|foundations|linear algebra/i.test(rawHeading)) stage = 'CORE';
      else if (/applied|system/i.test(rawHeading)) stage = 'APPLIED';
      else if (/practical|implementation|project/i.test(rawHeading)) stage = 'PRACTICAL';
      else if (/placement|interview/i.test(rawHeading)) stage = 'INTERVIEW';
      else if (/revision|cheat/i.test(rawHeading)) stage = 'REVISION';

      const match = rawHeading.match(/^(\d+)\.\s*(.*)/);
      const sectionNum = match ? match[1] + '.0' : `${result.length + 1}.0`;
      // Clean display title: strip redundant leading numbers "1. " and "Part X — " for compact card rendering
      const displayTitle = (match ? match[2] : rawHeading)
        .replace(/^Part\s+\d+\s*[-—:]\s*/i, '')
        .trim();

      // Extract concise, informative description (1-2 short sentences) from following lines
      let subtitle = '';
      for (let j = i + 1; j < Math.min(lines.length, i + 12); j++) {
        const nextLine = lines[j].trim();
        if (nextLine.startsWith('#') || nextLine === '---') break;
        if (
          nextLine.length > 20 &&
          !nextLine.startsWith('```') &&
          !nextLine.startsWith('|') &&
          !nextLine.startsWith('- **')
        ) {
          const cleaned = nextLine.replace(/[*_`]/g, '').trim();
          // Extract first 1-2 sentences
          const sentences = cleaned.match(/[^.!?]+[.!?]+(\s+[^.!?]+[.!?]+)?/);
          subtitle = sentences ? sentences[0].trim() : cleaned.slice(0, 140);
          break;
        }
      }

      currentSec = {
        id: slug,
        sectionNumber: sectionNum,
        title: displayTitle,
        subtitle: subtitle || undefined,
        stage,
        targetAnchor: slug,
        subtopics: [],
      };
      result.push(currentSec);
    } else if (heading && heading[1].length === mainHeadingLevel + 1 && currentSec) {
      const subHeading = heading[2].trim();
      currentSec.subtopics?.push(subHeading);
    }
  }

  return result;
}

export const LearningFlowchart: React.FC<LearningFlowchartProps> = ({
  topicId,
  topicTitle,
  markdownContent,
  nodes: customNodes,
  onSelectNode,
}) => {
  const flowchartNodes = useMemo(() => {
    if (customNodes && customNodes.length > 0) return customNodes;
    if (markdownContent) {
      const extracted = extractFlowchartFromMarkdown(markdownContent);
      if (extracted.length > 0) return extracted;
    }
    return [];
  }, [markdownContent, customNodes]);

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const { flowchartCompletions } = useGlobalProgress();
  const completedNodeIds = useMemo(() => new Set(flowchartCompletions[topicId] || []), [flowchartCompletions, topicId]);

  // Refs for dynamic SVG connector line calculation
  const containerRef = useRef<HTMLDivElement>(null);
  const centerCircleRef = useRef<HTMLDivElement>(null);
  const leftCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  interface ConnectorPath {
    id: string;
    d: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
  }
  const [connectorPaths, setConnectorPaths] = useState<ConnectorPath[]>([]);

  // Bidirectional Scroll spy
  useEffect(() => {
    if (flowchartNodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((prev, curr) =>
            curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
          );
          const anchorId = topEntry.target.getAttribute('id') || topEntry.target.getAttribute('data-anchor');
          if (anchorId) setActiveNodeId(anchorId);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    flowchartNodes.forEach((node) => {
      const el = document.getElementById(node.targetAnchor) || document.querySelector(`[data-anchor="${node.targetAnchor}"]`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [flowchartNodes]);

  const total = flowchartNodes.length;
  const completedCount = completedNodeIds.size;
  const progressPercent = Math.round((completedCount / total) * 100);

  // Split nodes for balanced 4-and-4 (or balanced N-and-M) distribution
  const midPoint = Math.ceil(total / 2);
  const leftNodes = useMemo(() => flowchartNodes.slice(0, midPoint), [flowchartNodes, midPoint]);
  const rightNodes = useMemo(() => flowchartNodes.slice(midPoint), [flowchartNodes, midPoint]);

  // Recalculate dynamic SVG connector paths
  const updateConnectors = () => {
    if (!containerRef.current || !centerCircleRef.current) return;
    const contRect = containerRef.current.getBoundingClientRect();
    const centerRect = centerCircleRef.current.getBoundingClientRect();

    const centerCenterX = centerRect.left + centerRect.width / 2 - contRect.left;
    const centerCenterY = centerRect.top + centerRect.height / 2 - contRect.top;
    const centerRadius = centerRect.width / 2;

    const newPaths: ConnectorPath[] = [];

    // Left nodes connect from their right border to the left curve of the central circle
    leftNodes.forEach((node, idx) => {
      const cardEl = leftCardRefs.current[idx];
      if (!cardEl) return;
      const cardRect = cardEl.getBoundingClientRect();

      const startX = cardRect.right - contRect.left;
      const startY = cardRect.top + cardRect.height / 2 - contRect.top;

      // Target point on the left hemisphere of the central circle
      // Angle based on vertical difference
      const dy = startY - centerCenterY;
      const angle = Math.max(-0.65, Math.min(0.65, dy / (centerRadius * 1.8)));
      const endX = centerCenterX - centerRadius * Math.cos(angle) + 4;
      const endY = centerCenterY + centerRadius * Math.sin(angle);

      // Smooth cubic bezier with horizontal entry and exit
      const cp1X = startX + (endX - startX) * 0.45;
      const cp1Y = startY;
      const cp2X = startX + (endX - startX) * 0.75;
      const cp2Y = endY;

      const pathStr = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
      newPaths.push({
        id: `left-${node.id}`,
        d: pathStr,
        startX,
        startY,
        endX,
        endY,
        color: PASTEL_PALETTE[idx % PASTEL_PALETTE.length].fill,
      });
    });

    // Right nodes connect from right curve of the central circle to their left border
    rightNodes.forEach((node, idx) => {
      const cardEl = rightCardRefs.current[idx];
      if (!cardEl) return;
      const cardRect = cardEl.getBoundingClientRect();

      const endX = cardRect.left - contRect.left;
      const endY = cardRect.top + cardRect.height / 2 - contRect.top;

      const actualIdx = midPoint + idx;
      const dy = endY - centerCenterY;
      const angle = Math.max(-0.65, Math.min(0.65, dy / (centerRadius * 1.8)));
      const startX = centerCenterX + centerRadius * Math.cos(angle) - 4;
      const startY = centerCenterY + centerRadius * Math.sin(angle);

      const cp1X = startX + (endX - startX) * 0.35;
      const cp1Y = startY;
      const cp2X = startX + (endX - startX) * 0.65;
      const cp2Y = endY;

      const pathStr = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
      newPaths.push({
        id: `right-${node.id}`,
        d: pathStr,
        startX,
        startY,
        endX,
        endY,
        color: PASTEL_PALETTE[actualIdx % PASTEL_PALETTE.length].fill,
      });
    });

    setConnectorPaths(newPaths);
  };

  // Recalculate on mount, expand/collapse, resize, and node changes
  useEffect(() => {
    // Initial and debounced animation frame calculation
    const timer = setTimeout(updateConnectors, 50);
    window.addEventListener('resize', updateConnectors);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateConnectors);
    };
  }, [flowchartNodes, expandedNodeId, leftNodes, rightNodes]);

  const handleNodeClick = (node: FlowchartNode) => {
    setActiveNodeId(node.id);

    if (onSelectNode) {
      onSelectNode(node.targetAnchor);
      return;
    }

    const targetEl =
      document.getElementById(node.targetAnchor) ||
      document.querySelector(`[data-anchor="${node.targetAnchor}"]`);

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      targetEl.classList.remove('heading-highlight-flash');
      void targetEl.offsetWidth;
      targetEl.classList.add('heading-highlight-flash');
    }
  };

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const previousCompleted = completedNodeIds.has(id);
    const completed = !previousCompleted;
    globalProgressStore.setFlowchartNode(topicId, id, completed);
    window.dispatchEvent(new CustomEvent('preptoplace:flowchart-progress-changed', {
      detail: { topicId, nodeId: id, completed, previousCompleted },
    }));
  };

  if (flowchartNodes.length === 0) {
    return null;
  }

  return (
    <div className="my-8 rounded-3xl bg-[#FAF9F5] border-[2.5px] border-[#171717] p-4 sm:p-8 shadow-[6px_6px_0px_#171717] relative overflow-hidden font-sans select-none">
      {/* Background sketch grid / paper feel */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#171717 1px, transparent 1px), radial-gradient(#171717 1px, #FAF9F5 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b-2 border-dashed border-[#171717]/20 relative z-10 gap-4 flex-wrap">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            {/* Desktop label */}
            <span
              className="hidden lg:inline-block text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full border-2 border-[#171717] bg-[#F5D547] text-[#171717]"
              style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '15px' }}
            >
              VISUAL ROADMAP
            </span>
            {/* Mobile/Tablet label */}
            <span
              className="lg:hidden text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full border-2 border-[#171717] bg-[#F5D547] text-[#171717]"
              style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '15px' }}
            >
              TOPIC ROADMAP
            </span>
            <span className="text-xs font-mono font-semibold text-slate-500">
              {total} Learning Milestones
            </span>
          </div>
          {/* Desktop heading */}
          <h2
            className="hidden lg:block text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#171717] tracking-tight mt-1 break-words max-w-xl"
            style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
          >
            Infographic Curriculum: Click any circle to jump
          </h2>
          {/* Mobile/Tablet heading */}
          <h2
            className="lg:hidden text-lg font-extrabold text-[#171717] tracking-tight mt-1 break-words"
            style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
          >
            Connected Learning Stages
          </h2>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717] shrink-0 self-start md:self-auto">
          <div className="text-right">
            <span
              className="text-sm font-bold text-[#171717] block leading-none"
              style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
            >
              {completedCount} of {total} Done
            </span>
            <div className="w-24 h-2 bg-slate-100 rounded-full border border-[#171717] overflow-hidden mt-1">
              <div
                className="h-full bg-[#B6C94B] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <span
            className="text-xl font-bold text-[#171717]"
            style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
          >
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* ─── DESKTOP INFOGRAPHIC VIEW (lg+): Balanced 4 & 4 Columns + Central Circle ─── */}
      <div ref={containerRef} className="hidden lg:block relative z-10 my-2">
        {/* SVG Curved Connector Lines Layer - dynamically positioned */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <defs>
            <filter id="handDrawnWobble">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          {/* Exactly 1 dynamic SVG connector path per milestone, behind cards */}
          {connectorPaths.map((cp) => (
            <g key={cp.id}>
              <path
                d={cp.d}
                fill="none"
                stroke="#171717"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
                filter="url(#handDrawnWobble)"
              />
              {/* Colored endpoint dot at card anchor */}
              <circle
                cx={cp.startX}
                cy={cp.startY}
                r="4.5"
                fill={cp.color}
                stroke="#171717"
                strokeWidth="1.75"
              />
              {/* Connector anchor dot at central circle */}
              <circle
                cx={cp.endX}
                cy={cp.endY}
                r="3.5"
                fill="#171717"
              />
            </g>
          ))}
        </svg>

        <div className="grid grid-cols-12 gap-6 items-stretch relative" style={{ zIndex: 1 }}>
          {/* Left Column of Learning Nodes (4 nodes evenly spaced) */}
          <div className="col-span-4 flex flex-col justify-between space-y-4">
            {leftNodes.map((node, idx) => (
              <div
                key={node.id}
                ref={(el) => {
                  leftCardRefs.current[idx] = el;
                }}
                className="w-full"
              >
                <InfographicNodeCard
                  node={node}
                  index={idx + 1}
                  color={PASTEL_PALETTE[idx % PASTEL_PALETTE.length]}
                  isActive={activeNodeId === node.id || activeNodeId === node.targetAnchor}
                  isCompleted={completedNodeIds.has(node.id)}
                  isExpanded={expandedNodeId === node.id}
                  onNodeClick={() => handleNodeClick(node)}
                  onToggleComplete={(e) => toggleComplete(node.id, e)}
                  onToggleExpand={(e) => {
                    e.stopPropagation();
                    setExpandedNodeId(expandedNodeId === node.id ? null : node.id);
                    setTimeout(updateConnectors, 50);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Center Column: Big Central Hand-Drawn Topic Circle (Centered Vertically & Horizontally) */}
          <div className="col-span-4 flex items-center justify-center p-2">
            <div
              ref={centerCircleRef}
              className="relative w-64 h-64 rounded-full flex flex-col items-center justify-center text-center p-6 bg-[#FAF9F5] border-[3.5px] border-[#171717] shadow-[5px_5px_0px_#171717] transition-transform duration-300 hover:scale-[1.02]"
              style={{
                borderRadius: '50% 48% 52% 49% / 49% 51% 48% 52%',
              }}
            >
              {/* Double outline hand-drawn effect */}
              <div
                className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#F5D547] pointer-events-none"
                style={{
                  borderRadius: '48% 52% 49% 51% / 51% 48% 52% 49%',
                }}
              />

              {/* Central topic banner */}
              <span
                className="text-xs uppercase font-extrabold tracking-widest px-3 py-0.5 rounded-full bg-[#F5D547] text-[#171717] border border-[#171717] mb-2"
                style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '16px' }}
              >
                LEARNING ROADMAP
              </span>

              <h1
                className="text-xl sm:text-2xl font-extrabold text-[#171717] leading-snug px-2"
                style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
              >
                {topicTitle}
              </h1>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#35C5C1] border border-[#171717]" />
                <span>Beginner to Placement</span>
              </div>
            </div>
          </div>

          {/* Right Column of Learning Nodes (4 nodes evenly spaced) */}
          <div className="col-span-4 flex flex-col justify-between space-y-4">
            {rightNodes.map((node, idx) => {
              const actualIdx = midPoint + idx;
              return (
                <div
                  key={node.id}
                  ref={(el) => {
                    rightCardRefs.current[idx] = el;
                  }}
                  className="w-full"
                >
                  <InfographicNodeCard
                    node={node}
                    index={actualIdx + 1}
                    color={PASTEL_PALETTE[actualIdx % PASTEL_PALETTE.length]}
                    isActive={activeNodeId === node.id || activeNodeId === node.targetAnchor}
                    isCompleted={completedNodeIds.has(node.id)}
                    isExpanded={expandedNodeId === node.id}
                    onNodeClick={() => handleNodeClick(node)}
                    onToggleComplete={(e) => toggleComplete(node.id, e)}
                    onToggleExpand={(e) => {
                      e.stopPropagation();
                      setExpandedNodeId(expandedNodeId === node.id ? null : node.id);
                      setTimeout(updateConnectors, 50);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── MOBILE & TABLET INFOGRAPHIC VIEW (<lg): Vertical Hand-Drawn Flow ─── */}
      <div className="lg:hidden relative z-10 space-y-5">
        {/* Top Central Topic Circle */}
        <div className="flex justify-center mb-6">
          <div
            className="w-56 h-56 rounded-full flex flex-col items-center justify-center text-center p-5 bg-[#FAF9F5] border-[3px] border-[#171717] shadow-[4px_4px_0px_#171717]"
            style={{ borderRadius: '50% 48% 52% 49% / 49% 51% 48% 52%' }}
          >
            <h1
              className="text-lg font-extrabold text-[#171717] leading-tight"
              style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
            >
              {topicTitle}
            </h1>
            <span className="text-[11px] font-mono text-slate-500 mt-2">
              {total} Connected Stages
            </span>
          </div>
        </div>

        {/* Vertical Nodes Connected by hand-drawn line */}
        <div className="space-y-4 relative">
          <div className="absolute left-6 top-8 bottom-8 w-[2.5px] border-l-2 border-dashed border-[#171717]/40 pointer-events-none" />

          {flowchartNodes.map((node, idx) => (
            <div key={node.id} className="relative pl-12">
              {/* Connector dot */}
              <div
                className="absolute left-[17px] top-6 w-4 h-4 rounded-full border-2 border-[#171717] z-10"
                style={{ backgroundColor: PASTEL_PALETTE[idx % PASTEL_PALETTE.length].fill }}
              />

              <InfographicNodeCard
                node={node}
                index={idx + 1}
                color={PASTEL_PALETTE[idx % PASTEL_PALETTE.length]}
                isActive={activeNodeId === node.id || activeNodeId === node.targetAnchor}
                isCompleted={completedNodeIds.has(node.id)}
                isExpanded={expandedNodeId === node.id}
                onNodeClick={() => handleNodeClick(node)}
                onToggleComplete={(e) => toggleComplete(node.id, e)}
                onToggleExpand={(e) => {
                  e.stopPropagation();
                  setExpandedNodeId(expandedNodeId === node.id ? null : node.id);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Individual Infographic Node Card ───────────────────────────────────────────
interface InfographicNodeCardProps {
  node: FlowchartNode;
  index: number;
  color: { fill: string; name: string; light: string };
  isActive: boolean;
  isCompleted: boolean;
  isExpanded: boolean;
  onNodeClick: () => void;
  onToggleComplete: (e: React.MouseEvent) => void;
  onToggleExpand: (e: React.MouseEvent) => void;
}

const InfographicNodeCard: React.FC<InfographicNodeCardProps> = ({
  node,
  index,
  color,
  isActive,
  isCompleted,
  isExpanded,
  onNodeClick,
  onToggleComplete,
  onToggleExpand,
}) => {
  const formattedNum = String(index).padStart(2, '0');

  return (
    <div
      onClick={onNodeClick}
      className={`rounded-2xl border-[2.5px] border-[#171717] p-4 bg-white transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_#171717] hover:shadow-[5px_5px_0px_#171717] hover:-translate-y-0.5 ${
        isActive
          ? 'ring-4 ring-[#171717]/20 border-[#171717] scale-[1.01]'
          : ''
      }`}
      style={{
        borderRadius: '16px 14px 18px 15px',
        minHeight: '84px',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Hand-drawn Circular Number Badge with Double Outline */}
        <div
          className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border-2 border-[#171717] shadow-[2px_2px_0px_#171717] mt-0.5"
          style={{
            backgroundColor: color.fill,
            borderRadius: '50% 48% 52% 49% / 49% 51% 48% 52%',
          }}
        >
          {/* Subtle inner sketch circle */}
          <div
            className="absolute inset-0.5 rounded-full border border-dashed border-white/60 pointer-events-none"
            style={{ borderRadius: '48% 52% 49% 51% / 51% 48% 52% 49%' }}
          />
          <span
            className="text-lg font-black text-[#171717] select-none"
            style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '24px', lineHeight: 1 }}
          >
            {formattedNum}
          </span>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span
              className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.2 rounded-full border border-[#171717]"
              style={{
                backgroundColor: color.light,
                fontFamily: "'Caveat', cursive, sans-serif",
                fontSize: '14px',
              }}
            >
              Stage {index}
            </span>

            <div className="flex items-center gap-1">
              {/* Checkmark Completion Button */}
              <button
                type="button"
                onClick={onToggleComplete}
                title={isCompleted ? 'Mark as incomplete' : 'Mark stage as completed'}
                className="p-1 rounded-md text-[#171717] hover:bg-slate-100 transition-colors"
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#B6C94B]" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Expand/Collapse Chevron control (reveals description & subtopics) */}
              <button
                type="button"
                onClick={onToggleExpand}
                className="p-1 rounded-md text-slate-600 hover:text-[#171717] hover:bg-slate-100 transition-colors"
                title={isExpanded ? 'Collapse description' : 'Expand description & topics'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Full title without truncate */}
          <h3
            className="text-base sm:text-lg font-extrabold text-[#171717] mt-0.5 leading-snug break-words hover:text-sky-700"
            style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
          >
            {node.title}
          </h3>

          {/* Current Section indicator (shown even when collapsed) */}
          {isActive && (
            <span className="inline-block mt-1 text-[9.5px] font-bold uppercase tracking-wider text-[#171717] bg-[#F5D547] px-2 py-0.2 rounded-md border border-[#171717]">
              Current Section
            </span>
          )}

          {/* Expanded Description & Content (revealed on expansion only) */}
          {isExpanded && (
            <div className="mt-2.5 pt-2 border-t border-dashed border-slate-300 animate-fadeIn">
              {node.subtitle && (
                <p className="text-[12px] text-slate-700 leading-relaxed mb-2 break-words">
                  {node.subtitle}
                </p>
              )}

              {/* Subtopics breakdown */}
              {node.subtopics && node.subtopics.length > 0 && (
                <div className="mt-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-1">
                    Key Modules ({node.subtopics.length}):
                  </span>
                  <div className="space-y-1">
                    {node.subtopics.map((st, i) => {
                      const subSlug = slugify(st);
                      return (
                        <div
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            const el =
                              document.getElementById(subSlug) ||
                              document.querySelector(`[data-anchor="${subSlug}"]`);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              el.classList.remove('heading-highlight-flash');
                              void el.offsetWidth;
                              el.classList.add('heading-highlight-flash');
                            }
                          }}
                          className="text-[11px] text-slate-700 hover:text-[#171717] hover:bg-[#FAF9F5] px-2 py-1 rounded-md transition-colors flex items-center gap-1.5 truncate border border-transparent hover:border-[#171717]/20"
                        >
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color.fill }} />
                          <span className="truncate">{st}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

