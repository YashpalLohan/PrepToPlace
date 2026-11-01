import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  Target,
  ArrowRight,
  BookOpen,
  Calendar,
  Award,
  ExternalLink
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { StorageService } from '../../services/storage';
import { DashboardStats, Track, DailyActivity, DailyGoal, Topic } from '../../types';
import { formatMinutes } from '../../lib/utils';
import { sortTracksByOrder, isExternalTrack } from '../../lib/trackConfig';
import { useGlobalProgress } from '../../stores/globalProgressStore';

export const DashboardPage: React.FC = () => {
  const { revision } = useGlobalProgress();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [recentActivities, setRecentActivities] = useState<DailyActivity[]>([]);
  const [todayGoal, setTodayGoal] = useState<DailyGoal | null>(null);
  const [recentTopics, setRecentTopics] = useState<Topic[]>([]);
  const [weeklyChartData, setWeeklyChartData] = useState<Array<{ day: string; minutes: number }>>([]);

  const loadDashboardData = () => {
    const s = StorageService.getDashboardStats();
    setStats(s);

    const tr = StorageService.getTracks();
    setTracks(sortTracksByOrder(tr));

    const acts = StorageService.getActivities();
    setRecentActivities(acts.slice(0, 5));

    const todayStr = new Date().toISOString().split('T')[0];
    const goal = StorageService.getGoal(todayStr);
    setTodayGoal(goal);

    // Derive this list from saved study dates/status rather than curriculum order.
    // Topics without a study date are included only when progress has started.
    const recent = StorageService.getAllTopics()
      .filter((topic) => Boolean(topic.lastStudied) || topic.status !== 'NOT_STARTED')
      .sort((a, b) => {
        const timeA = a.lastStudied ? new Date(a.lastStudied).getTime() : 0;
        const timeB = b.lastStudied ? new Date(b.lastStudied).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, 5);
    setRecentTopics(recent);

    // Weekly activity data (last 7 days)
    const last7Days: Array<{ day: string; minutes: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayMins = acts
        .filter((a) => a.date === dStr)
        .reduce((sum, curr) => sum + (curr.minutesSpent || 0), 0);
      last7Days.push({ day: dayLabel, minutes: dayMins });
    }
    setWeeklyChartData(last7Days);
  };

  useEffect(() => {
    loadDashboardData();
  }, [revision]);

  if (!stats) return null;

  return (
    <div className="space-y-9">
      {/* Page Title & Status */}
      <section className="grid grid-cols-1 gap-5 rounded-[1.5rem] border border-slate-200 bg-beige p-4 shadow-sm sm:gap-6 sm:rounded-[1.75rem] sm:p-6 md:grid-cols-[1.2fr_0.8fr] md:items-center md:p-8">
        <div className="max-w-2xl">
          <p className="editorial-eyebrow mb-3">PrepToPlace · Learning journal</p>
          <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl">Placement Overview</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            A clear view of your preparation, the skills you are building, and the next step in your learning.
          </p>
          <Link
            to="/tracks"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-sky-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-sky-800"
          >
            <span>Browse Tracks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-bluegray p-5 md:p-6">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border border-sky-200/70" />
          <div className="absolute -right-1 -top-3 h-24 w-24 rounded-full border border-sky-200/70" />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <span className="editorial-eyebrow">Learning progress</span>
              <TrendingUp className="h-4 w-4 text-sky-700" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-5xl font-semibold leading-none text-slate-900">{stats.overallPercentage}%</span>
              <span className="text-xs font-medium text-slate-600">overall mastery</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/80">
              <div className="h-full rounded-full bg-sky-600 transition-all" style={{ width: `${stats.overallPercentage}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-600">{stats.completedTopics} of {stats.totalTopics} topics completed</p>
          </div>
        </div>
      </section>

      {/* 1. Overall Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.currentStreak} Days</div>
          <div className="text-xs text-slate-500 mt-1">
            Longest record: {stats.longestStreak} days
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Hours</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalLearningHours} hrs</div>
          <div className="text-xs text-slate-500 mt-1">
            Across active learning tracks
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">In Progress</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.inProgressTopics}</div>
          <div className="text-xs text-slate-500 mt-1">
            {stats.pendingTopics} topics pending
          </div>
        </div>
      </div>

      {/* 2. Today's Activity & Weekly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Goal Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-600" />
                <span>Today's Target</span>
              </h2>
              <span className="text-xs font-medium text-slate-400">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Time Dedicated</span>
                  <span>{formatMinutes(stats.todayMinutes)} / {todayGoal?.targetMinutes || 120}m</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((stats.todayMinutes / (todayGoal?.targetMinutes || 120)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Topics Finished</span>
                  <span>{stats.todayCompletedCount} / {todayGoal?.targetTopics || 2} topics</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((stats.todayCompletedCount / (todayGoal?.targetTopics || 2)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Weekly Activity Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800">Weekly Study Minutes</h2>
            <span className="text-xs text-slate-400">Past 7 days activity</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D9D0C6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#657568' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#657568' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} minutes`, 'Time Spent']}
                  contentStyle={{ backgroundColor: '#1A3A21', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                />
                <Bar dataKey="minutes" fill="#2F844A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Primary 6 Tracks Progress Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold leading-tight text-slate-900">Featured learning tracks</h2>
          <Link to="/tracks" className="text-xs font-medium text-sky-600 hover:text-sky-700">
            View all tracks →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((track) => {
            const isExternal = isExternalTrack(track.slug, track.isExternal);
            const externalUrl =
              track.externalUrl ||
              (track.slug === 'dsa'
                ? 'https://prep-to-place.vercel.app/problems'
                : track.slug === 'development'
                ? 'https://prep-to-place.vercel.app/roadmap/dev-track'
                : 'https://prep-to-place.vercel.app/roadmap/core-subjects');
            const trackStat = StorageService.getTrackStats(track);

            if (isExternal) {
              return (
                <div
                  key={track.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-800">{track.name}</h3>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100">
                        External
                      </span>
                    </div>

                    <div className="my-2.5 py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Platform</span>
                      <span className="font-medium text-slate-600">Tracked on External Platform</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
                    <span className="text-slate-400">External Platform</span>
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                    >
                      {track.slug === 'dsa' ? 'Open Existing Platform' : 'Open Platform'} <ExternalLink className="w-3 h-3" />
                    </a>
                    {track.slug === 'dsa' && <a href="https://dsyashpal.vercel.app" target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1">Open My Platform <ExternalLink className="w-3 h-3" /></a>}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={track.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-800">{track.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {trackStat.progressPercentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-2.5">
                  <div
                    className="bg-sky-600 h-full rounded-full"
                    style={{ width: `${trackStat.progressPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
                  <span>{trackStat.completedTopics}/{trackStat.totalTopics} Topics</span>
                  <Link
                    to={`/tracks/${track.slug}`}
                    className="font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                  >
                    Open <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Grid: Recently Studied & Quick Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Studied Topics */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h2 className="mb-4 font-serif text-2xl font-semibold leading-tight text-slate-900">Continue learning</h2>
          {recentTopics.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No topics studied yet. Choose a track to start learning!
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentTopics.map((top) => (
                <Link
                  key={top.id}
                  to={`/topics/${top.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-medium text-slate-800 group-hover:text-sky-600">
                      {top.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                    {top.status.replace('_', ' ')}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800">Recent Learning Activity</h2>
          </div>

          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No learning activity yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start justify-between text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <div className="font-semibold text-slate-800">{act.topicTitle}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {act.trackName} • {act.date}
                    </div>
                  </div>
                  <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    +{act.minutesSpent}m
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
