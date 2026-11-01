import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { StorageService } from '../../../services/storage';
import { hasNotesAvailable, getNotesUnavailableReason } from '../../../services/notesAvailability';
import { Track, Section, Topic, TopicStatus } from '../../../types';
import { cn } from '../../../lib/utils';
import { useGlobalProgress } from '../../../stores/globalProgressStore';

export const DeepLearningPage: React.FC = () => {
  const { revision } = useGlobalProgress();
  const navigate = useNavigate();
  const [track, setTrack] = useState<Track | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});

  const loadData = () => {
    const t = StorageService.getTrackBySlug('ai-ml');
    if (t) {
      setTrack({ ...t });
      const sec = t.sections.find((s) => s.id === 'sec-aiml-deep-learning' || s.title === 'Deep Learning');
      if (sec) {
        setSection({ ...sec });
      }
    }
  };

  useEffect(() => {
    loadData();
    // Default open first 3 milestones
    setExpandedMilestones({
      'dl-m-1': true,
      'dl-m-2': true,
      'dl-m-3': true,
    });
  }, [revision]);

  const toggleExpand = (topicId: string) => {
    setExpandedMilestones((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const handleToggleComplete = (topic: Topic) => {
    if (!track) return;
    const newStatus: TopicStatus = topic.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
    StorageService.updateTopic(track.id, topic.id, { status: newStatus });
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
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/tracks/ai-ml" className="hover:text-slate-800 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> AI / ML Track
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900">Deep Learning</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/tracks/ai-ml/ml-foundations"
            className="text-xs font-medium text-slate-600 hover:text-sky-600 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>ML Foundations</span>
          </Link>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100 mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Section 2 of 3</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deep Learning Roadmap</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              60-day deep learning curriculum organized into 15 grouped learning milestones: Neural Networks, Backprop, Optimizers, CNNs, Sequence Modeling, Transformers, LoRA, and Multimodal AI.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
            <div className="text-center px-2">
              <div className="text-xs text-slate-400 font-medium">Milestones</div>
              <div className="text-lg font-bold text-slate-800">{stats.completed} / {stats.total}</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-xs text-slate-400 font-medium">Completion</div>
              <div className="text-lg font-bold text-violet-600">{stats.percentage}%</div>
            </div>
          </div>
        </div>

        {/* Section Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
            <span>Milestone Progress</span>
            <span>{stats.completed} of {stats.total} Milestones Completed ({stats.percentage}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-violet-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 15 Grouped Milestone Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Curriculum Milestones (15 Grouped Stages)
          </h2>
          <div className="text-xs text-slate-400">
            Day ranges are preserved per milestone
          </div>
        </div>

        {topics.map((topic) => {
          const isCompleted = topic.status === 'COMPLETED';
          const isExpanded = !!expandedMilestones[topic.id];

          return (
            <div
              key={topic.id}
              className={cn(
                'bg-white rounded-xl border transition-all',
                isCompleted ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'
              )}
            >
              {/* Card Header */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Mark Complete Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(topic)}
                    className={cn(
                      'w-6 h-6 rounded-md flex items-center justify-center border transition-all shrink-0',
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'border-slate-300 hover:border-violet-500 bg-white text-transparent'
                    )}
                    title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {/* Day Range Badge */}
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 border border-violet-100 font-mono shrink-0">
                    {topic.dayRange}
                  </span>

                  {/* Title & Short Description */}
                  <div
                    onClick={() => toggleExpand(topic.id)}
                    className="cursor-pointer truncate flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-sm font-semibold truncate',
                        isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                      )}>
                        {topic.title}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                          Done
                        </span>
                      )}
                    </div>
                    {topic.description && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {topic.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Actions: Notes Link & Accordion Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/topics/${topic.id}`)}
                    disabled={!hasNotesAvailable(topic)}
                    title={hasNotesAvailable(topic) ? 'Open notes' : getNotesUnavailableReason(topic)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shrink-0',
                      hasNotesAvailable(topic)
                        ? 'text-violet-700 bg-violet-50 hover:bg-violet-100'
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

              {/* Expandable Details Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100/80 space-y-4">
                  {topic.description && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Core Topics & Concepts
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {topic.description}
                      </p>
                    </div>
                  )}

                  {/* Recommended Resources List */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Recommended References & Resources
                    </div>
                    {topic.resources && topic.resources.length > 0 ? (
                      <div className="space-y-1.5">
                        {topic.resources.map((res, rIdx) => (
                          <div key={rIdx} className="flex items-center gap-2 text-xs">
                            {res.url ? (
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-800 hover:underline font-medium group"
                              >
                                <span>{res.title}</span>
                                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </a>
                            ) : (
                              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>{res.title}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        Allow me to add additional resources later.
                      </div>
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
