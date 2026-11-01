import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import { TopicStatus } from '../../types';
import { cn } from '../../lib/utils';

const statusOptions: { value: TopicStatus; label: string }[] = [
  { value: 'NOT_STARTED', label: 'Not Started' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'NEEDS_REVISION', label: 'Needs Revision' },
];

interface TopicStatusDropdownProps {
  status: TopicStatus;
  onChange: (status: TopicStatus) => void;
  ariaLabel: string;
}

export const TopicStatusDropdown: React.FC<TopicStatusDropdownProps> = ({ status, onChange, ariaLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    containerRef.current?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')?.focus();
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [isOpen]);

  const label = statusOptions.find(option => option.value === status)?.label || 'Not Started';
  const statusClasses = status === 'COMPLETED'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 focus-visible:ring-emerald-300'
    : status === 'IN_PROGRESS'
      ? 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100 focus-visible:ring-green-300'
      : status === 'NEEDS_REVISION'
        ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 focus-visible:ring-amber-300'
        : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200/80 focus-visible:ring-slate-300';

  const renderStatusIcon = (value: TopicStatus) => {
    if (value === 'COMPLETED') return <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />;
    if (value === 'NEEDS_REVISION') return <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />;
    return <span aria-hidden="true" className={cn('h-2 w-2 shrink-0 rounded-full', value === 'IN_PROGRESS' ? 'bg-emerald-600' : 'bg-slate-400')} />;
  };

  const moveMenuFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % items.length;
    else if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + items.length) % items.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = items.length - 1;
    else if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    } else return;
    event.preventDefault();
    items[nextIndex]?.focus();
  };

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
        onKeyDown={event => {
          if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        className={cn(
          'inline-flex min-h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          statusClasses,
          isOpen && 'ring-2 ring-offset-1'
        )}
      >
        {renderStatusIcon(status)}
        <span className="whitespace-nowrap">{label}</span>
        <ChevronDown aria-hidden="true" className={cn('h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-150', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={ariaLabel}
          onKeyDown={moveMenuFocus}
          className="absolute right-0 top-full z-50 mt-2 min-w-[172px] rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg shadow-slate-900/10 ring-1 ring-black/5"
        >
          {statusOptions.map(option => {
            const selected = status === option.value;
            const textColor = option.value === 'COMPLETED' ? 'text-emerald-800'
              : option.value === 'IN_PROGRESS' ? 'text-green-800'
                : option.value === 'NEEDS_REVISION' ? 'text-amber-800' : 'text-slate-600';
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300',
                  selected ? 'bg-emerald-50' : 'hover:bg-stone-50',
                  textColor
                )}
              >
                {renderStatusIcon(option.value)}
                <span className="flex-1">{option.label}</span>
                {selected && <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 text-emerald-700" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
