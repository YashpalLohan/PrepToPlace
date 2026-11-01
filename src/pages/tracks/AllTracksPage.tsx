import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Binary,
  CodeXml,
  Cpu,
  FolderGit2,
  Terminal,
  BookMarked,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ExternalLink
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { Track } from '../../types';
import { sortTracksByOrder, isExternalTrack } from '../../lib/trackConfig';

export const AllTracksPage: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const allTracks = StorageService.getTracks();
    setTracks(sortTracksByOrder(allTracks));
  }, []);

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'Binary': return <Binary className="w-5 h-5" />;
      case 'CodeXml': return <CodeXml className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Layers': return <FolderGit2 className="w-5 h-5" />;
      case 'Terminal': return <Terminal className="w-5 h-5" />;
      case 'BookMarked': return <BookMarked className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="editorial-eyebrow mb-2">Choose your next chapter</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">Primary Learning Tracks</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Structured preparation roadmaps designed for tech placement excellence.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track, trackIndex) => {
          const isExternal = isExternalTrack(track.slug, track.isExternal);
          const featureCard = trackIndex === 0 && !isExternal;
          const externalUrl =
            track.externalUrl ||
            (track.slug === 'dsa'
              ? 'https://prep-to-place.vercel.app/problems'
              : track.slug === 'development'
              ? 'https://prep-to-place.vercel.app/roadmap/dev-track'
              : 'https://prep-to-place.vercel.app/roadmap/core-subjects');
          const stats = StorageService.getTrackStats(track);

          if (isExternal) {
            return (
              <div
                key={track.id}
                className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-sky-300 hover:shadow-sm transition-all ${featureCard ? 'md:col-span-2 md:grid md:grid-cols-[1.2fr_0.8fr] md:gap-x-8 md:p-7' : ''}`}
              >
                <div>
                  {/* Header Icon + Name */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-700">
                      {getTrackIcon(track.iconName)}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100 flex items-center gap-1">
                      <span>External Platform</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-slate-900">{track.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {track.description}
                  </p>

                  {/* External Platform Info Badge */}
                  <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-600 mb-0.5">
                      Tracked on External Platform
                    </div>
                    <p className="text-[11px] text-slate-400">
                      All problems, roadmaps, and progress are managed directly on the external site.
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Est: {track.estimatedHours}h</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">External Service</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3">
                  <div className="flex flex-col gap-2">
                    {[{ label: track.slug === 'dsa' ? 'Open Existing Platform' : 'Open External Track', url: externalUrl }, ...(track.slug === 'dsa' ? [{ label: 'Open My Platform', url: 'https://dsayashpal.vercel.app' }] : [])].map(link => (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors group">
                        <span>{link.label}</span><ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={track.id}
              className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-sky-300 hover:shadow-sm transition-all ${featureCard ? 'md:col-span-2 md:grid md:grid-cols-[1.2fr_0.8fr] md:gap-x-8 md:p-7' : ''}`}
            >
              <div>
                {/* Header Icon + Name */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-700">
                    {getTrackIcon(track.iconName)}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {stats.progressPercentage}% Done
                  </span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-slate-900">{track.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {track.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{stats.completedTopics} / {stats.totalTopics} Topics</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${stats.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Est: {track.estimatedHours}h</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">Last: {stats.lastStudiedDate || 'Never'}</span>
                  </div>
                </div>
              </div>

              {/* View Track Button */}
              <div className="mt-5 pt-3">
                <Link
                  to={`/tracks/${track.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors group"
                >
                  <span>View Track</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
