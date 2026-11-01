import React, { useState } from 'react';
import { Plus, X, FolderPlus } from 'lucide-react';
import { Section } from '../../types';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, isComingSoon: boolean, parentId?: string) => void;
  existingSections: Section[];
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingSections,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isComingSoon, setIsComingSoon] = useState(false);
  const [parentId, setParentId] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), description.trim(), isComingSoon, parentId || undefined);
    setTitle('');
    setDescription('');
    setIsComingSoon(false);
    setParentId('');
    onClose();
  };

  // Flatten sections for parent dropdown
  const flatSections: Array<{ id: string; title: string }> = [];
  const collect = (list: Section[], prefix = '') => {
    for (const sec of list) {
      flatSections.push({ id: sec.id, title: prefix + sec.title });
      if (sec.subsections) collect(sec.subsections, prefix + sec.title + ' > ');
    }
  };
  collect(existingSections);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-base">
            <FolderPlus className="w-5 h-5 text-sky-600" />
            <span>Add Section / Module</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Section Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Arrays & Hashing, Tree Traversals, Microservices..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nest Under Parent Section (Optional)
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="">None (Top-Level Section)</option>
              {flatSections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.title}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports unlimited nested sub-sections.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Short outline of what this section covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isComingSoon"
              checked={isComingSoon}
              onChange={(e) => setIsComingSoon(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
            />
            <label htmlFor="isComingSoon" className="text-sm font-medium text-slate-700 cursor-pointer">
              Mark as "Coming Soon" (visually disabled placeholder)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Section</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
