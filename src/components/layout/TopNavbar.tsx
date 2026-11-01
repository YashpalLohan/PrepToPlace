import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar as CalendarIcon, User, X, Menu } from 'lucide-react';
import { StorageService } from '../../services/storage';

export const TopNavbar: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof StorageService.globalSearch>>([]);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = StorageService.globalSearch(searchQuery);
      setSearchResults(results);
      setActiveResult(0);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isSpotlightOpen) searchInputRef.current?.focus();
  }, [isSpotlightOpen]);

  const closeSpotlight = () => {
    setIsSpotlightOpen(false);
    setSearchQuery('');
    setActiveResult(0);
  };

  const openResult = (link: string) => {
    closeSpotlight();
    navigate(link);
  };

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName || '');
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSpotlightOpen(true);
      } else if (event.key === '/' && !isTyping && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        setIsSpotlightOpen(true);
      } else if (event.key === 'Escape') {
        setIsSpotlightOpen(false);
      } else if (isSpotlightOpen && event.key === 'ArrowDown' && searchResults.length) {
        event.preventDefault();
        setActiveResult(index => (index + 1) % searchResults.length);
      } else if (isSpotlightOpen && event.key === 'ArrowUp' && searchResults.length) {
        event.preventDefault();
        setActiveResult(index => (index - 1 + searchResults.length) % searchResults.length);
      } else if (isSpotlightOpen && event.key === 'Enter' && searchResults[activeResult]) {
        event.preventDefault();
        openResult(searchResults[activeResult].link);
      }
    };
    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, [isSpotlightOpen, searchResults, activeResult]);

  return (
    <header className={`h-16 bg-white border-b border-slate-200 sticky top-0 ${isSpotlightOpen ? 'z-[110]' : 'z-30'} px-3 sm:px-6 flex items-center gap-3 justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)]`}>
      <button type="button" onClick={onMenuClick} aria-label="Open navigation menu" className="md:hidden shrink-0 rounded-lg p-2 text-slate-600 hover:bg-slate-100">
        <Menu className="h-5 w-5" />
      </button>
      {/* Global Search Bar */}
      <div className="relative w-full max-w-md flex-1">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tracks, sections, topics, notes... (Ctrl+K)"
            value=""
            readOnly
            onClick={() => setIsSpotlightOpen(true)}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setIsSpotlightOpen(true); }}
            className="w-full pl-10 pr-20 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400 cursor-pointer"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">Ctrl K</span>
        </div>
      </div>

      {/* Right Controls: Date, Badge, Profile */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>{today}</span>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* Profile Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-semibold text-xs shadow-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-700 leading-tight">Yashpal</div>
            <div className="text-[10px] text-slate-400">Prep Candidate</div>
          </div>
        </div>
      </div>
      {isSpotlightOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/35 backdrop-blur-[2px] px-4 pt-[12vh] sm:pt-[16vh]"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closeSpotlight(); }}
        >
          <div role="dialog" aria-modal="true" aria-label="Search PrepToPlace" className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tracks, sections, topics, notes..."
                className="h-16 min-w-0 flex-1 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400"
              />
              {searchQuery && <button type="button" aria-label="Clear search" onClick={() => setSearchQuery('')} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>}
              <button type="button" onClick={closeSpotlight} className="rounded border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-400 hover:bg-slate-50">ESC</button>
            </div>
            <div className="max-h-[min(60vh,480px)] overflow-y-auto p-2">
              {!searchQuery.trim() ? (
                <div className="px-4 py-8 text-center text-sm text-slate-400">Start typing to search your tracks, topics, and notes.</div>
              ) : searchResults.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">No results for “{searchQuery}”.</div>
              ) : searchResults.map((item, index) => (
                <button
                  key={`${item.type}-${item.link}-${item.title}`}
                  type="button"
                  onMouseEnter={() => setActiveResult(index)}
                  onClick={() => openResult(item.link)}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3 text-left transition-colors ${activeResult === index ? 'bg-sky-50' : 'hover:bg-slate-50'}`}
                >
                  <span className="min-w-0"><span className="block truncate text-sm font-medium text-slate-800">{item.title}</span><span className="mt-0.5 block truncate text-xs text-slate-400">{item.subtitle}</span></span>
                  <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-500">{item.type}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400"><span>↑↓ to navigate</span><span>↵ to open</span><span>esc to close</span></div>
          </div>
        </div>
      )}
    </header>
  );
};
