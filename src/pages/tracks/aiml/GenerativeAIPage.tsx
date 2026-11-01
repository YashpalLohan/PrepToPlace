import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Layers,
  Clock
} from 'lucide-react';
import { StorageService } from '../../../services/storage';
import { hasNotesAvailable, getNotesUnavailableReason } from '../../../services/notesAvailability';
import { Track, Section, Topic, TopicStatus } from '../../../types';
import { cn } from '../../../lib/utils';
import { useGlobalProgress } from '../../../stores/globalProgressStore';

export const GenerativeAIPage: React.FC = () => {
  const { revision } = useGlobalProgress();
  const navigate = useNavigate();
  const [track, setTrack] = useState<Track | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const loadData = () => {
    const t = StorageService.getTrackBySlug('ai-ml');
    if (t) {
      setTrack({ ...t });
      const sec = t.sections.find(
        (s) => s.id === 'sec-aiml-generative-ai' || s.title === 'Generative AI'
      );
      if (sec) setSection({ ...sec });
    }
  };

  useEffect(() => {
    loadData();
    setExpanded({ 'int-m-1': true });
  }, [revision]);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleToggleComplete = (topic: Topic) => {
    if (!track) return;
    const next: TopicStatus =
      topic.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
    StorageService.updateTopic(track.id, topic.id, { status: next });
    loadData();
  };

  if (!track || !section) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-semibold text-slate-800">Section not found</h2>
        <Link to="/tracks/ai-ml" className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-sky-600">
          <ArrowLeft className="w-4 h-4" /> Back to AI/ML Track
        </Link>
      </div>
    );
  }

  const stats = StorageService.getSectionStats(section);
  const topics = section.topics || [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/tracks/ai-ml" className="hover:text-slate-800 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> AI / ML Track
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-900">Generative AI</span>
      </div>

      {/* Header Card */}
      <div className="rounded-[1.75rem] border border-slate-200 bg-beige p-6 shadow-sm md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Section 3 of 3</span>
            </div>
            <h1 className="font-serif text-4xl font-semibold leading-none tracking-tight text-slate-900 md:text-5xl">Generative AI</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              A practical 60-day journey from AI/ML fundamentals to Generative AI, RAG, Agentic AI
              and portfolio development across 19 structured milestones.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4 shrink-0">
            <div className="text-center px-2">
              <div className="text-xs text-slate-400 font-medium">Milestones</div>
              <div className="text-lg font-bold text-slate-800">{stats.completed} / {stats.total}</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-xs text-slate-400 font-medium">Completion</div>
              <div className="text-lg font-bold text-amber-600">{stats.percentage}%</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
            <span>Overall Progress (Days 1–60)</span>
            <span>{stats.completed} of {stats.total} Milestones Completed</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>60 learning days</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
            <span>{stats.completed} completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span>{stats.pending} remaining</span>
          </div>
        </div>
      </div>

      {/* 19 Milestone Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            19 Milestones — Days 1–60
          </h2>
          <span className="text-xs text-slate-400">Expand cards to view topics and resources</span>
        </div>

        {topics.map((topic, idx) => {
          const isCompleted = topic.status === 'COMPLETED';
          const isExpanded = !!expanded[topic.id];

          return (
            <div
              key={topic.id}
              className={cn(
                'bg-white rounded-xl border transition-all',
                isCompleted
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              )}
            >
              {/* Card Header Row */}
              <div className="p-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleComplete(topic)}
                  className={cn(
                    'w-6 h-6 rounded-md flex items-center justify-center border transition-all shrink-0',
                    isCompleted
                      ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                      : 'border-slate-300 hover:border-amber-400 bg-white text-transparent'
                  )}
                  title={isCompleted ? 'Unmark as Completed' : 'Mark as Completed'}
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </button>

                <span className="text-[10px] font-bold text-slate-500 uppercase tabular-nums shrink-0 w-5">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-100 font-mono shrink-0">
                  {topic.dayRange}
                </span>

                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => toggleExpand(topic.id)}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      'text-sm font-semibold',
                      isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                    )}>
                      {topic.title}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                        Done
                      </span>
                    )}
                  </div>
                  {topic.description && (
                    <p className="text-xs text-slate-500 truncate mt-0.5 hidden sm:block">
                      {topic.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate(`/topics/${topic.id}`)}
                    disabled={!hasNotesAvailable(topic)}
                    title={hasNotesAvailable(topic) ? 'Open notes' : getNotesUnavailableReason(topic)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                      hasNotesAvailable(topic)
                        ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                        : 'text-slate-400 bg-slate-100 cursor-not-allowed opacity-60'
                    )}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Notes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleExpand(topic.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100/80 space-y-4">
                  {topic.description && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Topics Covered
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {topic.description}
                      </p>
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Recommended Resources
                    </div>
                    {topic.resources && topic.resources.length > 0 ? (
                      <div className="space-y-2">
                        {topic.resources.map((res, rIdx) => (
                          <div key={rIdx} className="flex items-center gap-2 text-xs">
                            {res.url ? (
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-900 hover:underline font-medium group"
                              >
                                <span>{res.title}</span>
                                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </a>
                            ) : (
                              <span className="text-slate-700 font-medium">{res.title}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">No resources specified.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
