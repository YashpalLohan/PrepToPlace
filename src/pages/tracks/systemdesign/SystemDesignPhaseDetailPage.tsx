import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Pencil,
  Save,
  X,
  Clock,
  FlaskConical,
  BookMarked,
  Code2
} from 'lucide-react';
import { StorageService } from '../../../services/storage';
import { hasNotesAvailable, getNotesUnavailableReason } from '../../../services/notesAvailability';
import { Track, Section, Topic, TopicStatus, TopicResource } from '../../../types';
import { cn } from '../../../lib/utils';
import { SYSTEM_DESIGN_SECTIONS } from '../../../data/systemDesignCurriculum';
import { useGlobalProgress } from '../../../stores/globalProgressStore';

const STATUS_CONFIG: Record<TopicStatus, { label: string; color: string; bg: string; border: string }> = {
  NOT_STARTED: { label: 'Not Started', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' },
  COMPLETED: { label: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  NEEDS_REVISION: { label: 'Needs Revision', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
};

const isPractice = (t: Topic) => {
  const lower = t.title.toLowerCase();
  return (
    lower.startsWith('project:') ||
    lower.startsWith('machine code:') ||
    lower.startsWith('task:') ||
    lower.includes('tic tac toe') ||
    lower.includes('snake & ladder') ||
    lower.includes('vending machine') ||
    lower.includes('atm system') ||
    lower.includes('parking lot') ||
    lower.includes('splitwise') ||
    lower.includes('elevator system') ||
    lower.includes('food delivery') ||
    lower.includes('meeting room') ||
    lower.includes('logging framework') ||
    lower.includes('inventory management') ||
    lower.includes('rate limiter') ||
    lower.includes('in-memory cache') ||
    lower.includes('thread-safe') ||
    lower.includes('url shortener') ||
    lower.includes('file system design') ||
    lower.includes('task scheduler') ||
    lower.includes('distributed lock') ||
    lower.includes('search index') ||
    lower.includes('chat app') ||
    lower.includes('api gateway') ||
    lower.includes('online code editor') ||
    lower.includes('version control system') ||
    lower.includes('microsoft:') ||
    lower.includes('atlassian:') ||
    lower.includes('flipkart:') ||
    lower.includes('uber:')
  );
};

export const SystemDesignPhaseDetailPage: React.FC = () => {
  const { revision } = useGlobalProgress();
  const { phaseId } = useParams<{ phaseId: string }>();
  const navigate = useNavigate();
  const [track, setTrack] = useState<Track | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editingResource, setEditingResource] = useState<Record<string, string | null>>({});
  const [resourceDraft, setResourceDraft] = useState<Record<string, string>>({});
  const [statusMenuOpen, setStatusMenuOpen] = useState<string | null>(null);

  const sectionId = phaseId ? `sec-sd-${phaseId}` : '';

  const loadData = () => {
    const t = StorageService.getTrackBySlug('system-design');
    if (t) {
      setTrack({ ...t });
      const sec = t.sections.find((s) => s.id === sectionId);
      if (sec) setSection({ ...sec });
    }
  };

  useEffect(() => {
    loadData();
    const meta = SYSTEM_DESIGN_SECTIONS.find((s) => s.id === sectionId);
    if (meta?.topics?.[0]) {
      setExpanded({ [meta.topics[0].id]: true });
    }
  }, [phaseId, revision]);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleUpdateStatus = (topic: Topic, status: TopicStatus) => {
    if (!track) return;
    StorageService.updateTopic(track.id, topic.id, { status });
    setStatusMenuOpen(null);
    loadData();
  };

  const resKey = (topicId: string, idx: number) => `${topicId}_${idx}`;

  const startEditResource = (topicId: string, idx: number, currentUrl?: string) => {
    const k = resKey(topicId, idx);
    setEditingResource((prev) => ({ ...prev, [k]: currentUrl ?? '' }));
    setResourceDraft((prev) => ({ ...prev, [k]: currentUrl ?? '' }));
  };

  const cancelEditResource = (topicId: string, idx: number) => {
    const k = resKey(topicId, idx);
    setEditingResource((prev) => { const next = { ...prev }; delete next[k]; return next; });
  };

  const saveResourceUrl = (topic: Topic, idx: number) => {
    if (!track) return;
    const k = resKey(topic.id, idx);
    const url = resourceDraft[k]?.trim() || undefined;
    const updatedResources: TopicResource[] = (topic.resources || []).map((r, i) =>
      i === idx ? { ...r, url } : r
    );
    StorageService.updateTopic(track.id, topic.id, { resources: updatedResources });
    cancelEditResource(topic.id, idx);
    loadData();
  };

  const phaseIndex = SYSTEM_DESIGN_SECTIONS.findIndex((s) => s.id === sectionId);
  const prevPhase = phaseIndex > 0 ? SYSTEM_DESIGN_SECTIONS[phaseIndex - 1] : null;
  const nextPhase = phaseIndex < SYSTEM_DESIGN_SECTIONS.length - 1 ? SYSTEM_DESIGN_SECTIONS[phaseIndex + 1] : null;
  const phaseSlug = (id: string) => id.replace('sec-sd-', '');

  if (!track || !section) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-semibold text-slate-800">Phase not found</h2>
        <Link to="/tracks/system-design" className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-amber-600">
          <ArrowLeft className="w-4 h-4" /> Back to System Design Track
        </Link>
      </div>
    );
  }

  const stats = StorageService.getSectionStats(section);
  const conceptTopics = (section.topics || []).filter((t) => !isPractice(t));
  const practiceTopics = (section.topics || []).filter((t) => isPractice(t));
  const phaseNum = phaseIndex;

  return (
    <div className="space-y-6">
      {/* Breadcrumb + phase navigation */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/tracks/system-design" className="hover:text-slate-800 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> System Design Track
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900 truncate max-w-[220px]">{section.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {prevPhase && (
            <Link
              to={`/tracks/system-design/${phaseSlug(prevPhase.id)}`}
              className="text-xs font-medium text-slate-600 hover:text-amber-700 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Prev Phase
            </Link>
          )}
          {nextPhase && (
            <Link
              to={`/tracks/system-design/${phaseSlug(nextPhase.id)}`}
              className="text-xs font-medium text-slate-600 hover:text-amber-700 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 transition-colors"
            >
              Next Phase <ArrowLeft className="w-3 h-3 rotate-180" />
            </Link>
          )}
        </div>
      </div>

      {/* Header card */}
      <div className="rounded-[1.5rem] border border-slate-200 bg-beige p-4 shadow-sm sm:rounded-[1.75rem] sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 mb-2">
              <span>Phase {phaseNum} of {SYSTEM_DESIGN_SECTIONS.length - 1}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">{section.title}</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">{section.description}</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4 shrink-0">
            <div className="text-center px-2">
              <div className="text-xs text-slate-400 font-medium">Items</div>
              <div className="text-lg font-bold text-slate-800">{stats.completed} / {stats.total}</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-xs text-slate-400 font-medium">Progress</div>
              <div className="text-lg font-bold text-amber-600">{stats.percentage}%</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
            <span>Phase Progress</span>
            <span>{stats.completed} of {stats.total} items completed</span>
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
            <BookMarked className="w-3.5 h-3.5 text-slate-400" />
            <span>{conceptTopics.length} topics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-amber-500" />
            <span>{practiceTopics.length} practice tasks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{stats.completed} completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>{stats.inProgress} in progress</span>
          </div>
        </div>
      </div>

      {/* Topics section */}
      {conceptTopics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-slate-400" />
              {phaseIndex === 0 ? 'Resources & Reading' : 'Core Topics'}
            </h2>
            <span className="text-xs text-slate-400">{conceptTopics.length} items</span>
          </div>
          {conceptTopics.map((t) => (
            <SDTopicCard
              key={t.id}
              topic={t}
              isExpanded={!!expanded[t.id]}
              onToggleExpand={() => toggleExpand(t.id)}
              onUpdateStatus={(s) => handleUpdateStatus(t, s)}
              onOpenNotes={() => navigate(`/topics/${t.id}`)}
              statusMenuOpen={statusMenuOpen}
              onOpenStatusMenu={() => setStatusMenuOpen(statusMenuOpen === t.id ? null : t.id)}
              onCloseStatusMenu={() => setStatusMenuOpen(null)}
              editingResource={editingResource}
              resourceDraft={resourceDraft}
              onStartEdit={(idx, url) => startEditResource(t.id, idx, url)}
              onCancelEdit={(idx) => cancelEditResource(t.id, idx)}
              onSaveEdit={(idx) => saveResourceUrl(t, idx)}
              onResourceDraftChange={(k, val) => setResourceDraft((prev) => ({ ...prev, [k]: val }))}
              resKey={resKey}
            />
          ))}
        </div>
      )}

      {/* Practice section */}
      {practiceTopics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-500" />
              {phaseIndex === 4 ? 'Practice Problems' : 'Action Items & Projects'}
            </h2>
            <span className="text-xs text-slate-400">{practiceTopics.length} tasks</span>
          </div>
          {practiceTopics.map((t) => (
            <SDTopicCard
              key={t.id}
              topic={t}
              isExpanded={!!expanded[t.id]}
              onToggleExpand={() => toggleExpand(t.id)}
              onUpdateStatus={(s) => handleUpdateStatus(t, s)}
              onOpenNotes={() => navigate(`/topics/${t.id}`)}
              statusMenuOpen={statusMenuOpen}
              onOpenStatusMenu={() => setStatusMenuOpen(statusMenuOpen === t.id ? null : t.id)}
              onCloseStatusMenu={() => setStatusMenuOpen(null)}
              editingResource={editingResource}
              resourceDraft={resourceDraft}
              onStartEdit={(idx, url) => startEditResource(t.id, idx, url)}
              onCancelEdit={(idx) => cancelEditResource(t.id, idx)}
              onSaveEdit={(idx) => saveResourceUrl(t, idx)}
              onResourceDraftChange={(k, val) => setResourceDraft((prev) => ({ ...prev, [k]: val }))}
              resKey={resKey}
              isPractice
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SDTopicCard sub-component
// ─────────────────────────────────────────────────────────────────────────────
interface SDTopicCardProps {
  topic: Topic;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateStatus: (s: TopicStatus) => void;
  onOpenNotes: () => void;
  statusMenuOpen: string | null;
  onOpenStatusMenu: () => void;
  onCloseStatusMenu: () => void;
  editingResource: Record<string, string | null>;
  resourceDraft: Record<string, string>;
  onStartEdit: (idx: number, url?: string) => void;
  onCancelEdit: (idx: number) => void;
  onSaveEdit: (idx: number) => void;
  onResourceDraftChange: (k: string, val: string) => void;
  resKey: (topicId: string, idx: number) => string;
  isPractice?: boolean;
}

const SDTopicCard: React.FC<SDTopicCardProps> = ({
  topic,
  isExpanded,
  onToggleExpand,
  onUpdateStatus,
  onOpenNotes,
  statusMenuOpen,
  onOpenStatusMenu,
  onCloseStatusMenu,
  editingResource,
  resourceDraft,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onResourceDraftChange,
  resKey,
  isPractice = false,
}) => {
  const statusCfg = STATUS_CONFIG[topic.status];
  const isCompleted = topic.status === 'COMPLETED';
  const isMenuOpen = statusMenuOpen === topic.id;

  return (
    <div
      className={cn(
        'bg-white rounded-xl border transition-all',
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/20'
          : isPractice
          ? 'border-dashed border-amber-200 bg-amber-50/30 hover:border-amber-300'
          : 'border-slate-200 hover:border-amber-200'
      )}
    >
      <div className="p-4 flex items-center gap-3">
        {/* Completion toggle */}
        <button
          type="button"
          onClick={() => onUpdateStatus(isCompleted ? 'NOT_STARTED' : 'COMPLETED')}
          className={cn(
            'w-6 h-6 rounded-md flex items-center justify-center border transition-all shrink-0',
            isCompleted
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
              : isPractice
              ? 'border-amber-300 hover:border-amber-500 bg-white text-transparent'
              : 'border-slate-300 hover:border-amber-400 bg-white text-transparent'
          )}
          title={isCompleted ? 'Mark as Not Started' : 'Mark as Completed'}
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
        </button>

        {isPractice && (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
            Practice
          </span>
        )}

        {/* Title */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggleExpand}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('text-sm font-semibold', isCompleted ? 'line-through text-slate-400' : 'text-slate-900')}>
              {topic.title}
            </span>
            {isCompleted && (
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">Done</span>
            )}
          </div>
          {topic.description && (
            <p className="text-xs text-slate-500 truncate mt-0.5 hidden sm:block">{topic.description}</p>
          )}
        </div>

        {/* Status dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={onOpenStatusMenu}
            className={cn('text-[10px] font-semibold uppercase px-2 py-1 rounded border transition-colors', statusCfg.bg, statusCfg.color, statusCfg.border)}
          >
            {statusCfg.label}
          </button>
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={onCloseStatusMenu} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-lg min-w-[160px] py-1">
                {(Object.keys(STATUS_CONFIG) as TopicStatus[]).map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onUpdateStatus(s)}
                      className="w-full text-left px-3 py-2 text-xs font-medium transition-colors hover:bg-slate-50 flex items-center gap-2"
                    >
                      <span className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded border', cfg.bg, cfg.color, cfg.border)}>
                        {cfg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Notes */}
        <button
          type="button"
          onClick={onOpenNotes}
          disabled={!hasNotesAvailable(topic)}
          title={hasNotesAvailable(topic) ? 'Open notes' : getNotesUnavailableReason(topic)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shrink-0',
            hasNotesAvailable(topic)
              ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
              : 'text-slate-400 bg-slate-100 cursor-not-allowed opacity-60'
          )}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Notes</span>
        </button>

        {/* Accordion */}
        <button
          type="button"
          onClick={onToggleExpand}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-100/80 space-y-4">
          {topic.description && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Overview</div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {topic.description}
              </p>
            </div>
          )}

          {topic.resources && topic.resources.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Resources</div>
              <div className="space-y-2">
                {topic.resources.map((res, rIdx) => {
                  const k = resKey(topic.id, rIdx);
                  const isEditing = editingResource[k] !== undefined;
                  return (
                    <div key={rIdx} className="flex items-center gap-2 text-xs">
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="url"
                            placeholder="https://..."
                            value={resourceDraft[k] ?? ''}
                            onChange={(e) => onResourceDraftChange(k, e.target.value)}
                            className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400"
                            autoFocus
                          />
                          <button type="button" onClick={() => onSaveEdit(rIdx)} className="p-1 text-amber-600 hover:text-amber-800 rounded" title="Save">
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => onCancelEdit(rIdx)} className="p-1 text-slate-400 hover:text-slate-600 rounded" title="Cancel">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : res.url ? (
                        <div className="flex items-center gap-2 flex-1">
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-900 hover:underline font-medium group"
                          >
                            <span>{res.title}</span>
                            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                          <span className="text-slate-700 font-medium">{res.title}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onOpenNotes}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Open full notes editor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
