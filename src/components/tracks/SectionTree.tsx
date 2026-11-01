import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  BookOpen,
  Lock,
} from 'lucide-react';
import { Section, Topic, TopicStatus } from '../../types';
import { cn } from '../../lib/utils';
import { TopicStatusDropdown } from './TopicStatusDropdown';

interface SectionTreeProps {
  section: Section;
  level?: number;
  trackId: string;
  onAddSubSection: (parentId: string) => void;
  onAddTopic: (sectionId: string, sectionTitle: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onUpdateTopicStatus: (topicId: string, status: TopicStatus) => void;
  onDeleteTopic: (topicId: string) => void;
}

export const SectionTree: React.FC<SectionTreeProps> = ({
  section,
  level = 0,
  trackId,
  onAddSubSection,
  onAddTopic,
  onDeleteSection,
  onUpdateTopicStatus,
  onDeleteTopic,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const isComingSoon = section.isComingSoon;

  return (
    <div
      className={cn(
        'rounded-xl border transition-all mb-3',
        level === 0 ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50/70 border-slate-200/80 mt-2',
        isComingSoon && 'opacity-65 select-none bg-slate-50/50'
      )}
      style={{ marginLeft: level > 0 ? `${level * 16}px` : 0 }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between p-3.5 group">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2 truncate">
            <span
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                'font-semibold text-sm cursor-pointer hover:text-sky-600 transition-colors truncate',
                level === 0 ? 'text-slate-800' : 'text-slate-700'
              )}
            >
              {section.title}
            </span>

            {isComingSoon && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded">
                <Lock className="w-3 h-3" /> Coming Soon
              </span>
            )}

            {section.description && (
              <span className="text-xs text-slate-400 truncate hidden md:inline">
                – {section.description}
              </span>
            )}
          </div>
        </div>


      </div>

      {/* Expanded Content: Topics and Subsections */}
      {isOpen && (
        <div className="px-3.5 pb-3 pt-1 border-t border-slate-100">
          {/* Topics List */}
          {section.topics && section.topics.length > 0 ? (
            <div className="space-y-2 mb-3">
              {section.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/90 hover:border-sky-300 hover:shadow-xs transition-all group/item"
                >
                  <div
                    onClick={() => navigate(`/topics/${topic.id}`)}
                    className="flex items-center gap-2.5 flex-1 cursor-pointer min-w-0 pr-3"
                  >
                    <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="text-sm font-medium text-slate-800 hover:text-sky-600 truncate">
                      {topic.title}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center">
                    <TopicStatusDropdown
                      status={topic.status}
                      onChange={status => onUpdateTopicStatus(topic.id, status)}
                      ariaLabel={`Update status for ${topic.title}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isComingSoon &&
            (!section.subsections || section.subsections.length === 0) && (
              <div className="py-4 text-center text-xs text-slate-400">
                Coming Soon — Content for this section is being prepared.
              </div>
            )
          )}

          {/* Nested Subsections */}
          {section.subsections && section.subsections.length > 0 && (
            <div className="space-y-2 mt-2">
              {section.subsections.map((sub) => (
                <SectionTree
                  key={sub.id}
                  section={sub}
                  level={level + 1}
                  trackId={trackId}
                  onAddSubSection={onAddSubSection}
                  onAddTopic={onAddTopic}
                  onDeleteSection={onDeleteSection}
                  onUpdateTopicStatus={onUpdateTopicStatus}
                  onDeleteTopic={onDeleteTopic}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
