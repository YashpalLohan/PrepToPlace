import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  Filter,
  Target
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { DailyActivity, DailyGoal, Track } from '../../types';
import { formatMinutes } from '../../lib/utils';

export const LearningActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [trackSlug, setTrackSlug] = useState('ai-ml');
  const [topicTitle, setTopicTitle] = useState('');
  const [minutesSpent, setMinutesSpent] = useState(45);
  const [topicsCompleted, setTopicsCompleted] = useState(1);
  const [remarks, setRemarks] = useState('');

  const loadData = () => {
    setActivities(StorageService.getActivities());
    setTracks(StorageService.getTracks());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim()) return;

    const matchedTrack = tracks.find((t) => t.slug === trackSlug);
    const trackName = matchedTrack ? matchedTrack.name : trackSlug.toUpperCase();

    StorageService.logActivity({
      date,
      trackSlug,
      trackName,
      topicTitle: topicTitle.trim(),
      minutesSpent: Number(minutesSpent),
      topicsCompleted: Number(topicsCompleted),
      remarks: remarks.trim(),
    });

    setIsLogModalOpen(false);
    setTopicTitle('');
    setRemarks('');
    loadData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this activity entry?')) {
      StorageService.deleteActivity(id);
      loadData();
    }
  };

  const filteredActivities =
    selectedTrack === 'all'
      ? activities
      : activities.filter((a) => a.trackSlug === selectedTrack);

  const totalMinutes = filteredActivities.reduce((acc, a) => acc + (a.minutesSpent || 0), 0);
  const totalCompletedTopics = filteredActivities.reduce((acc, a) => acc + (a.topicsCompleted || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Learning Activity Log</h1>
          <p className="text-sm text-slate-500 mt-1">
            Day-wise timeline of study sessions, notes revision, and topics cleared.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log Study Session</span>
        </button>
      </div>

      {/* Aggregate stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Total Study Time
          </div>
          <div className="text-xl font-bold text-slate-900">{formatMinutes(totalMinutes)}</div>
          <div className="text-xs text-slate-400 mt-0.5">{filteredActivities.length} sessions logged</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Topics Mastered
          </div>
          <div className="text-xl font-bold text-slate-900">{totalCompletedTopics} Topics</div>
          <div className="text-xs text-slate-400 mt-0.5">Marked completed during study</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Filter by Track
          </div>
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="w-full mt-1 px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">All Tracks</option>
            {tracks.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Timeline Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No activity logged yet</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Record your daily preparation hours and track topics completed.
            </p>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Log First Session</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Track</th>
                  <th className="py-3 px-4">Topic / Concepts</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Completed</th>
                  <th className="py-3 px-4">Personal Remarks</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono">
                      {act.date}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-100 text-slate-700">
                        {act.trackName}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{act.topicTitle}</td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-emerald-700">
                      {formatMinutes(act.minutesSpent)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {act.topicsCompleted > 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {act.topicsCompleted}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {act.remarks || '–'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(act.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Activity Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Log Learning Session
            </h2>

            <form onSubmit={handleCreateActivity} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Track
                  </label>
                  <select
                    value={trackSlug}
                    onChange={(e) => setTrackSlug(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {tracks.map((t) => (
                      <option key={t.slug} value={t.slug}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Topic / Concepts Studied *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph BFS, Docker compose configuration..."
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Minutes Spent
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="720"
                    value={minutesSpent}
                    onChange={(e) => setMinutesSpent(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Topics Completed Today
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={topicsCompleted}
                    onChange={(e) => setTopicsCompleted(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Personal Remarks / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Key roadblocks, takeaways, or revision reminders..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
