import React, { useState } from 'react';
import {
  Database,
  Cloud,
  Download,
  Upload,
  Check,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export const SettingsPage: React.FC = () => {
  const [storageProvider, setStorageProvider] = useState<'local' | 'supabase' | 'cloudinary'>('local');
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleExportData = () => {
    const backup = {
      tracks: StorageService.getTracks(),
      activities: StorageService.getActivities(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preptoplace-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.tracks && Array.isArray(data.tracks)) {
          StorageService.saveTracks(data.tracks);
        }
        if (data.activities && Array.isArray(data.activities)) {
          localStorage.setItem('preptoplace_activities_v1', JSON.stringify(data.activities));
        }
        alert('Data imported and restored successfully!');
        window.location.reload();
      } catch (err) {
        alert('Invalid backup JSON format.');
      }
    };
    reader.readAsText(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all progress and tracks to default? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage image storage options and back up or restore learning data.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Image Storage Abstraction */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-800 font-semibold text-sm">
            <Cloud className="w-4 h-4 text-sky-600" />
            <span>Image Storage Architecture</span>
          </div>

          <div className="mt-4 space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              PrepToPlace abstracts image storage to prevent heavy binary images from clogging the relational database.
              You can run with optimized local base64 storage now, or connect Supabase Storage / Cloudinary buckets when ready.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'local', title: 'Local Optimized', subtitle: 'Zero setup, works offline' },
                { id: 'supabase', title: 'Supabase Storage', subtitle: 'S3-compatible bucket' },
                { id: 'cloudinary', title: 'Cloudinary CDN', subtitle: 'High speed image hosting' },
              ].map((prov) => (
                <label
                  key={prov.id}
                  onClick={() => setStorageProvider(prov.id as any)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    storageProvider === prov.id
                      ? 'border-sky-500 bg-sky-50/50 ring-1 ring-sky-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-800">{prov.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{prov.subtitle}</div>
                </label>
              ))}
            </div>

            {storageProvider !== 'local' && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {storageProvider === 'supabase' ? 'Supabase Project URL & Anon Key' : 'Cloudinary API Key / URL'}
                </label>
                <input
                  type="password"
                  placeholder="Paste connection key or secret..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Backup & Data Portability */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-800 font-semibold text-sm">
            <Database className="w-4 h-4 text-sky-600" />
            <span>Backup & Data Portability</span>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleExportData}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export All Notes & Progress (JSON)</span>
            </button>

            <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>Import & Restore Backup</span>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Reset Data to Default</span>
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Saved!
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
