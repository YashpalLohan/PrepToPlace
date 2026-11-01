import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  Binary, BookMarked,
  CodeXml, Cpu, ExternalLink, FolderGit2, GraduationCap, LayoutDashboard,
  Layers, Terminal,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const mainItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Tracks', path: '/tracks', icon: Layers, end: true },
];

const trackItems = [
  { label: 'AI / ML', path: '/tracks/ai-ml', icon: Cpu, color: 'text-violet-600' },
  { label: 'System Design', path: '/tracks/system-design', icon: FolderGit2, color: 'text-amber-600' },
  { label: 'DevOps', path: '/tracks/devops', icon: Terminal, color: 'text-rose-600' },
  { label: 'DSA', path: '/tracks/dsa', icon: Binary, color: 'text-sky-600', externalUrl: 'https://prep-to-place.vercel.app/problems' },
  { label: 'Development', path: '/tracks/development', icon: CodeXml, color: 'text-emerald-600', externalUrl: 'https://prep-to-place.vercel.app/roadmap/dev-track' },
  { label: 'Core Subjects', path: '/tracks/core-subjects', icon: BookMarked, color: 'text-indigo-600', externalUrl: 'https://prep-to-place.vercel.app/roadmap/core-subjects' },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const [dsaMenuOpen, setDsaMenuOpen] = useState(false);
  const [dsaMenuTop, setDsaMenuTop] = useState(0);
  const dsaButtonRef = useRef<HTMLButtonElement>(null);
  const compact = collapsed && !mobileOpen;
  const renderLink = (item: typeof mainItems[number] | typeof trackItems[number], isTrack = false) => {
    const Icon = item.icon;
    const color = isTrack && 'color' in item ? item.color : undefined;
    const externalUrl = 'externalUrl' in item ? item.externalUrl : undefined;
    const end = 'end' in item ? item.end : false;
    const base = cn(
      'group relative flex h-11 w-full items-center rounded-lg text-[13px] font-medium transition-colors duration-150',
      compact && 'justify-center px-0',
      !compact && 'gap-3 px-3',
    );
    const icon = <Icon className={cn('h-5 w-5 shrink-0 transition-colors', color || 'text-slate-500')} strokeWidth={1.8} />;
    const label = !compact && <span className="min-w-0 flex-1 truncate">{item.label}</span>;
    const extIcon = externalUrl && !compact && <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />;
    const tooltip = compact && <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-[120] -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity delay-300 group-hover:opacity-100">{item.label}{externalUrl ? ' · External' : ''}</span>;

    if (externalUrl && item.label === 'DSA') return (
      <div key={item.path} className="relative">
        {compact ? <button ref={dsaButtonRef} type="button" onClick={() => {
          const bounds = dsaButtonRef.current?.getBoundingClientRect();
          if (bounds) setDsaMenuTop(bounds.top);
          setDsaMenuOpen(open => !open);
        }} aria-label="Open DSA platforms" aria-expanded={dsaMenuOpen}
          className={cn(base, 'justify-center px-0 text-slate-600 hover:bg-slate-50 hover:text-slate-900')}>
          {icon}<span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-[120] -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity delay-300 group-hover:opacity-100">DSA platforms</span>
        </button> : <a href={externalUrl} target="_blank" rel="noopener noreferrer" onClick={onMobileClose} className={cn(base, 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')} aria-label="Existing DSA Platform">{icon}{label}</a>}
        {compact && dsaMenuOpen && createPortal(<div role="menu" aria-label="DSA platforms" className="fixed z-[200] w-52 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg" style={{ left: 88, top: dsaMenuTop }}>
          <a role="menuitem" href={externalUrl} target="_blank" rel="noopener noreferrer" onClick={() => { setDsaMenuOpen(false); onMobileClose(); }} className="flex min-h-9 items-center justify-between gap-2 rounded-md px-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">Existing DSA Platform<ExternalLink className="h-3.5 w-3.5 shrink-0" /></a>
          <a role="menuitem" href="https://dsayashpal.vercel.app" target="_blank" rel="noopener noreferrer" onClick={() => { setDsaMenuOpen(false); onMobileClose(); }} className="flex min-h-9 items-center justify-between gap-2 rounded-md px-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">My DSA Platform<ExternalLink className="h-3.5 w-3.5 shrink-0" /></a>
        </div>, document.body)}
        {!compact && <div className="ml-9 mt-0.5 mb-1 flex flex-col gap-0.5 border-l border-slate-200 pl-3 text-[11px]">
          {[{ label: 'Existing DSA Platform', href: externalUrl }, { label: 'My DSA Platform', href: 'https://dsayashpal.vercel.app' }].map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" onClick={onMobileClose} className="flex min-h-7 items-center justify-between gap-2 rounded-md px-2 text-slate-500 hover:bg-slate-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"><span>{link.label}</span><ExternalLink className="h-3 w-3 shrink-0" /></a>)}
        </div>}
      </div>
    );
    if (externalUrl) return (
      <a key={item.path} href={externalUrl} target="_blank" rel="noopener noreferrer" onClick={onMobileClose}
        className={cn(base, 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')} aria-label={item.label}>
        {icon}{label}{extIcon}{tooltip}
      </a>
    );

    return (
      <NavLink key={item.path} to={item.path} end={end} onClick={onMobileClose}
        className={({ isActive }) => cn(base, isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')} aria-label={item.label}>
        {({ isActive }) => <>{icon}{label}{isActive && !compact && <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-sky-600" />}{tooltip}</>}
      </NavLink>
    );
  };

  return (
    <>
      {mobileOpen && <button type="button" aria-label="Close navigation menu" onClick={onMobileClose} className="fixed inset-0 z-[80] bg-slate-950/35 backdrop-blur-[1px] md:hidden" />}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-[90] flex h-dvh flex-col border-r border-slate-200 bg-white transition-[width,transform] duration-150 ease-out motion-reduce:transition-none',
        collapsed ? 'w-[80px]' : 'w-64',
        'max-md:w-[280px]',
        mobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full',
      )}>
        <div className={cn(
          'relative flex h-16 shrink-0 items-center border-b border-slate-100',
          compact ? 'justify-center px-2' : 'justify-between px-4',
        )}>
          <div className={cn('flex min-w-0 items-center', compact ? 'justify-center' : 'gap-3')}>
            <button type="button" onClick={mobileOpen ? onMobileClose : onToggle} aria-label={mobileOpen ? 'Close navigation menu' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white transition-colors hover:bg-sky-700">
              <GraduationCap className="h-5 w-5" strokeWidth={2} />
            </button>
            {!compact && <div className="min-w-0"><div className="truncate text-[15px] font-bold leading-5 tracking-tight text-slate-900">Prep<span className="text-sky-600">To</span>Place</div><div className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">Learning workspace</div></div>}
          </div>
        </div>

        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-4">
          <section>
            {!compact && <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Main Menu</h2>}
            <div className="flex flex-col gap-1">{mainItems.map(item => renderLink(item))}</div>
          </section>
          <section className="mt-4">
            <div className={cn('mb-2 border-t border-slate-100', compact ? 'mx-2' : 'px-3 pt-3')}>
              {!compact && <h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Learning Tracks</h2>}
            </div>
            <div className="flex flex-col gap-1">{trackItems.map(item => renderLink(item, true))}</div>
          </section>
        </nav>
        {!compact && <div className="shrink-0 border-t border-slate-100 px-5 py-3 text-[10px] font-medium text-slate-400">Learn steadily. Build confidently.</div>}
      </aside>
    </>
  );
};
