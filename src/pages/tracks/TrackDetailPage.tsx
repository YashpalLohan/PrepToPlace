import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Plus,
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Calendar
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { Track, TopicStatus } from '../../types';
import { SectionTree } from '../../components/tracks/SectionTree';
import { AddSectionModal } from '../../components/tracks/AddSectionModal';
import { AddTopicModal } from '../../components/tracks/AddTopicModal';
import { cn } from '../../lib/utils';
import { useGlobalProgress } from '../../stores/globalProgressStore';

export const TrackDetailPage: React.FC = () => {
  const { revision } = useGlobalProgress();
  const { slug } = useParams<{ slug: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [activeParentSectionId, setActiveParentSectionId] = useState<string | undefined>();
  const [addTopicModal, setAddTopicModal] = useState<{
    isOpen: boolean;
    sectionId: string;
    sectionTitle: string;
  }>({ isOpen: false, sectionId: '', sectionTitle: '' });

  const loadTrack = () => {
    if (!slug) return;
    const found = StorageService.getTrackBySlug(slug);
    if (found) {
      setTrack({ ...found });
    }
  };

  useEffect(() => {
    if (slug === 'dsa') {
      window.location.href = 'https://prep-to-place.vercel.app/problems';
      return;
    }
    if (slug === 'development') {
      window.location.href = 'https://prep-to-place.vercel.app/roadmap/dev-track';
      return;
    }
    if (slug === 'core-subjects') {
      window.location.href = 'https://prep-to-place.vercel.app/roadmap/core-subjects';
      return;
    }
    const found = slug ? StorageService.getTrackBySlug(slug) : null;
    if (found?.isExternal && found.externalUrl) {
      window.location.href = found.externalUrl;
      return;
    }
    loadTrack();
  }, [slug, revision]);

  if (!track) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-semibold text-slate-800">Track not found</h2>
        <p className="text-sm text-slate-500 mt-2">The requested learning track does not exist.</p>
        <Link
          to="/tracks"
          className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 text-xs font-semibold text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tracks
        </Link>
      </div>
    );
  }

  const stats = StorageService.getTrackStats(track);

  // Handlers
  const handleAddSection = (
    title: string,
    description: string,
    isComingSoon: boolean,
    parentId?: string
  ) => {
    StorageService.addSection(track.id, {
      trackId: track.id,
      title,
      description,
      isComingSoon,
      parentId: parentId || activeParentSectionId,
      order: 0,
    });
    setActiveParentSectionId(undefined);
    loadTrack();
  };

  const handleAddTopic = (title: string) => {
    if (!addTopicModal.sectionId) return;
    StorageService.addTopic(track.id, addTopicModal.sectionId, title);
    loadTrack();
  };

  const handleDeleteSection = (sectionId: string) => {
    if (window.confirm('Are you sure you want to delete this section and all its contents?')) {
      StorageService.deleteSection(track.id, sectionId);
      loadTrack();
    }
  };

  const handleUpdateTopicStatus = (topicId: string, status: TopicStatus) => {
    StorageService.updateTopic(track.id, topicId, { status });
    loadTrack();
  };

  const handleDeleteTopic = (topicId: string) => {
    if (window.confirm('Delete this topic and its notes?')) {
      StorageService.deleteTopic(track.id, topicId);
      loadTrack();
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/tracks"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all tracks
        </Link>
      </div>

      {/* Track Header Card */}
      <div className="grid grid-cols-1 gap-5 rounded-[1.5rem] border border-slate-200 bg-beige p-4 shadow-sm sm:gap-6 sm:rounded-[1.75rem] sm:p-6 md:grid-cols-[1.2fr_0.8fr] md:items-center md:p-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="min-w-0 break-words font-serif text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl">{track.name}</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                {stats.progressPercentage}% Completed
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">{track.description}</p>
          </div>

          {/* Quick Metrics */}
          <div className="flex w-full shrink-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white/75 p-4 text-xs text-slate-600 xl:w-auto xl:flex-row xl:items-center xl:gap-6">
            <div className="min-w-0 xl:flex-none">
              <div className="whitespace-nowrap font-medium text-slate-400">Est. Learning Time</div>
              <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="whitespace-nowrap">{track.estimatedHours} Hours</span>
              </div>
            </div>
            <div className="h-px w-full shrink-0 bg-slate-200 xl:h-8 xl:w-px" />
            <div className="min-w-0 xl:flex-none">
              <div className="whitespace-nowrap font-medium text-slate-400">Last Studied</div>
              <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="break-words">{stats.lastStudiedDate || 'Not started'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
            <span>Overall Track Progress</span>
            <span>{stats.completedTopics} of {stats.totalTopics} Topics Completed</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Breakdown pill counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-500">Completed:</span>
            <span className="font-semibold text-slate-800">{stats.completedTopics}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-4 h-4 text-sky-500" />
            <span className="text-slate-500">In Progress:</span>
            <span className="font-semibold text-slate-800">{stats.inProgressTopics}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-slate-500">Needs Revision:</span>
            <span className="font-semibold text-slate-800">{stats.needsRevisionTopics}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">Pending:</span>
            <span className="font-semibold text-slate-800">{stats.pendingTopics}</span>
          </div>
        </div>
      </div>

      {/* AI/ML Specific Three Section Cards View */}
      {track.slug === 'ai-ml' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-slate-900">Specialized Curriculum Tracks</h2>
            <span className="text-xs text-slate-400">3 Core Modules</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {track.sections.map((sec) => {
              const secStats = StorageService.getSectionStats(sec);
              const isComingSoon = sec.isComingSoon;
              const linkUrl =
                sec.id === 'sec-aiml-ml-foundations' || sec.title === 'ML Foundations'
                  ? '/tracks/ai-ml/ml-foundations'
                  : sec.id === 'sec-aiml-deep-learning' || sec.title === 'Deep Learning'
                  ? '/tracks/ai-ml/deep-learning'
                  : '/tracks/ai-ml/generative-ai';

              return (
                <div
                  key={sec.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between transition-all hover:border-violet-300 hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {sec.title}
                      </h3>
                      {isComingSoon ? (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                          COMING SOON
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100 shrink-0">
                          {secStats.percentage}%
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                      {sec.description}
                    </p>

                    {/* Progress Section — Unified for both active and coming soon states */}
                    <div>
                      {!isComingSoon ? (
                        <>
                          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                            <span>Progress</span>
                            <span>{secStats.completed} / {secStats.total} Milestones</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-violet-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${secStats.percentage}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg py-2.5">
                          Content under development
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <Link
                      to={linkUrl}
                      className={cn(
                        'w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors group',
                        isComingSoon
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                      )}
                    >
                      <span>Open Section</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DevOps — 9 Phase Cards */}
      {track.slug === 'devops' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-slate-900">DevOps Roadmap Phases</h2>
            <span className="text-xs text-slate-400">9 Phases</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {track.sections.map((sec) => {
              const secStats = StorageService.getSectionStats(sec);
              const phaseSlug = sec.id.replace('sec-devops-', '');
              return (
                <div
                  key={sec.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-sm p-5 shadow-xs flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{sec.title}</h3>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 shrink-0">
                        {secStats.percentage}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                      {sec.description}
                    </p>

                    <div>
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>{secStats.completed} / {secStats.total} topics</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${secStats.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <Link
                      to={`/tracks/devops/${phaseSlug}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors group bg-rose-50 text-rose-700 hover:bg-rose-100"
                    >
                      <span>Open Phase</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* System Design — 5 Phase Cards */}
      {track.slug === 'system-design' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-slate-900">System Design Roadmap Phases</h2>
            <span className="text-xs text-slate-400">5 Phases</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {track.sections.map((sec) => {
              const secStats = StorageService.getSectionStats(sec);
              const phaseSlug = sec.id.replace('sec-sd-', '');
              return (
                <div
                  key={sec.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-sm p-5 shadow-xs flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{sec.title}</h3>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 shrink-0">
                        {secStats.percentage}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                      {sec.description}
                    </p>

                    <div>
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>{secStats.completed} / {secStats.total} topics</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${secStats.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <Link
                      to={`/tracks/system-design/${phaseSlug}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors group bg-amber-50 text-amber-700 hover:bg-amber-100"
                    >
                      <span>Open Phase</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sections and Topic Hierarchy */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            {track.slug === 'ai-ml'
              ? 'Curriculum Tree & Custom Modules'
              : track.slug === 'devops'
              ? 'Phase Tree & Custom Modules'
              : track.slug === 'system-design'
              ? 'Phase Tree & Custom Modules'
              : 'Track Curriculum & Roadmap'}
          </h2>
          <span className="text-xs text-slate-400">
            {track.sections.length} {track.sections.length === 1 ? 'Section' : 'Sections'}
          </span>
        </div>

        {track.sections.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">Coming Soon</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Curriculum sections for {track.name} are being prepared.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {track.sections.map((section) => (
              <SectionTree
                key={section.id}
                section={section}
                trackId={track.id}
                onAddSubSection={(parentId) => {
                  setActiveParentSectionId(parentId);
                  setIsAddSectionOpen(true);
                }}
                onAddTopic={(sectionId, sectionTitle) => {
                  setAddTopicModal({ isOpen: true, sectionId, sectionTitle });
                }}
                onDeleteSection={handleDeleteSection}
                onUpdateTopicStatus={handleUpdateTopicStatus}
                onDeleteTopic={handleDeleteTopic}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        onSubmit={handleAddSection}
        existingSections={track.sections}
      />

      <AddTopicModal
        isOpen={addTopicModal.isOpen}
        sectionTitle={addTopicModal.sectionTitle}
        onClose={() => setAddTopicModal({ isOpen: false, sectionId: '', sectionTitle: '' })}
        onSubmit={handleAddTopic}
      />
    </div>
  );
};
