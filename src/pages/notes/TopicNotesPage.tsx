import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  Eye,
  Save,
  Upload,
  Trash2,
  Calendar,
  CheckCircle2,
  FileText,
  Plus,
  X,
  Code,
  List,
  Heading,
  Tag,
  ExternalLink,
  Bookmark,
  Target
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { Topic, TopicNote, Track, TopicStatus, NoteImage } from '../../types';
import { MarkdownRenderer, formatMath } from '../../components/notes/MarkdownRenderer';
import { LearningFlowchart } from '../../components/notes/LearningFlowchart';
import { BackToTop } from '../../components/BackToTop';
import { hasNotesAvailable } from '../../services/notesAvailability';
import { TopicStatusDropdown } from '../../components/tracks/TopicStatusDropdown';

export const TopicNotesPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [topicData, setTopicData] = useState<{ topic: Topic; track: Track; sectionTitle: string } | null>(() =>
    topicId ? StorageService.getTopicById(topicId) : null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [markdown, setMarkdown] = useState(() => topicData?.topic.note?.markdown || '');
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>(() => topicData?.topic.note?.keyTakeaways || []);
  const [newTakeaway, setNewTakeaway] = useState('');
  const [relatedTopics, setRelatedTopics] = useState<string[]>(() => topicData?.topic.note?.relatedTopics || []);
  const [newRelated, setNewRelated] = useState('');
  const [images, setImages] = useState<NoteImage[]>(() => topicData?.topic.note?.images || []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = () => {
    if (!topicId) return;
    const res = StorageService.getTopicById(topicId);
    if (res) {
      setTopicData(res);
      const note = res.topic.note;
      setMarkdown(note?.markdown || '');
      setKeyTakeaways(note?.keyTakeaways || []);
      setRelatedTopics(note?.relatedTopics || []);
      setImages(note?.images || []);
    }
  };

  useEffect(() => {
    loadData();
  }, [topicId]);

  if (!topicData) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-semibold text-slate-800">Topic not found</h2>
        <p className="text-sm text-slate-500 mt-2">The topic you requested does not exist.</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 text-xs font-semibold text-sky-600 bg-sky-50 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const { topic, track, sectionTitle } = topicData;
  const sectionRoutes: Record<string, string> = {
    'ML Foundations': '/tracks/ai-ml/ml-foundations',
    'Deep Learning': '/tracks/ai-ml/deep-learning',
    'Generative AI': '/tracks/ai-ml/generative-ai',
  };
  const sectionRoute = track.slug === 'ai-ml' ? sectionRoutes[sectionTitle] : undefined;

  if (!hasNotesAvailable(topic)) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-semibold text-slate-800">Notes are not available yet.</h2>
        <p className="text-sm text-slate-500 mt-2">Saved notes for this topic will appear here when they are ready.</p>
        <Link to={`/tracks/${track.slug}`} className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 text-xs font-semibold text-sky-700 bg-sky-50 rounded-lg">
          <ArrowLeft className="w-4 h-4" /> Back to track
        </Link>
      </div>
    );
  }

  // Render a takeaway string — supports $inline math$ and `inline code` backtick syntax
  const renderTakeaway = (text: string): React.ReactNode => {
    const mathParts = text.split(/(\$[^$]+\$)/g);
    return mathParts.map((mPart, mi) => {
      if (mPart.startsWith('$') && mPart.endsWith('$') && mPart.length >= 3) {
        return (
          <span
            key={'m-' + mi}
            className="math-formula mx-1"
            style={{
              color: '#FF4D4D',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
              fontSize: '1em',
            }}
          >
            {formatMath(mPart.slice(1, -1))}
          </span>
        );
      }
      const codeParts = mPart.split(/(`[^`]+`)/g);
      return codeParts.map((cPart, ci) => {
        if (cPart.startsWith('`') && cPart.endsWith('`') && cPart.length >= 3) {
          return (
            <code
              key={'c-' + mi + '-' + ci}
              className="px-1.5 py-0.5 mx-0.5 rounded bg-sky-100/70 text-sky-800 font-mono text-[11.5px] border border-sky-200/60 not-italic"
            >
              {cPart.slice(1, -1)}
            </code>
          );
        }
        return <span key={'t-' + mi + '-' + ci}>{cPart}</span>;
      });
    });
  };

  const handleSaveNotes = () => {
    const updatedNote: TopicNote = {
      id: topic.note?.id || 'note-' + Date.now(),
      topicId: topic.id,
      markdown,
      keyTakeaways,
      relatedTopics,
      images,
      lastUpdated: new Date().toISOString(),
    };

    StorageService.updateTopic(track.id, topic.id, {
      note: updatedNote,
    });

    setIsEditing(false);
    loadData();
  };

  const handleStatusChange = (status: TopicStatus) => {
    StorageService.updateTopic(track.id, topic.id, { status });
    loadData();
  };

  // Image Upload handler (Base64 storage with support for preview, captions, removal)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newImg: NoteImage = {
          id: 'img-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          url,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          createdAt: new Date().toISOString(),
        };
        setImages((prev) => [...prev, newImg]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (imgId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  const handleUpdateImageCaption = (imgId: string, caption: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === imgId ? { ...img, caption } : img))
    );
  };

  // Quick markdown insert helpers
  const insertText = (before: string, after: string = '') => {
    setMarkdown((prev) => prev + `\n${before}text${after}\n`);
  };

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <Link to={`/tracks/${track.slug}`} className="hover:text-slate-800 transition-colors">
            {track.name}
          </Link>
          <span>/</span>
          {sectionRoute ? (
            <Link to={sectionRoute} className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              {sectionTitle}
            </Link>
          ) : (
            <span className="text-slate-600">{sectionTitle}</span>
          )}
          <span>/</span>
          <span className="font-semibold text-slate-900">{topic.title}</span>
        </div>

      </div>

      {/* Topic Title Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              {track.name} • {sectionTitle}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {topic.title}
            </h1>
            {topic.dayRange && (
              <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100">
                {topic.dayRange}
              </span>
            )}
            {topic.description && (
              <p className="text-xs text-slate-600 mt-2 max-w-2xl leading-relaxed">
                {topic.description}
              </p>
            )}
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400">Status:</span>
            <TopicStatusDropdown
              status={topic.status}
              onChange={handleStatusChange}
              ariaLabel={`Update status for ${topic.title}`}
            />
          </div>
        </div>

        {/* Resources list */}
        {topic.resources && topic.resources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Curated Resources
            </span>
            <div className="flex flex-wrap gap-2">
              {topic.resources.map((res, idx) => (
                res.url ? (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 rounded-lg transition-colors group"
                  >
                    <span>{res.title}</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                ) : (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg"
                  >
                    {res.title}
                  </span>
                )
              ))}
            </div>
          </div>
        )}

        {topic.note?.lastUpdated && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last Updated: {new Date(topic.note.lastUpdated).toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Mode View: Reading Mode vs Editing Mode */}
      {isEditing ? (
        /* EDITING MODE */
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            {/* Markdown Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertText('## ')}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1"
                  title="Heading 2"
                >
                  <Heading className="w-4 h-4" /> H2
                </button>
                <button
                  type="button"
                  onClick={() => insertText('### ')}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1"
                  title="Heading 3"
                >
                  <Heading className="w-3.5 h-3.5" /> H3
                </button>
                <button
                  type="button"
                  onClick={() => insertText('- ')}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1"
                  title="Bullet list"
                >
                  <List className="w-4 h-4" /> List
                </button>
                <button
                  type="button"
                  onClick={() => insertText('```javascript\n', '\n```')}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1"
                  title="Code snippet"
                >
                  <Code className="w-4 h-4" /> Code
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>

            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Revision Notes (Markdown Supported)
            </label>
            <textarea
              rows={14}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Write concise revision notes (1-2 pages), formulas, time complexities, code snippets, or interview talking points..."
              className="w-full p-4 text-sm font-mono bg-slate-50/60 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 leading-relaxed"
            />
          </div>

          {/* Key Takeaways Editor */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Important Concepts & Key Takeaways</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add a core takeaway (e.g. In-place reversal takes O(1) space)..."
                value={newTakeaway}
                onChange={(e) => setNewTakeaway(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTakeaway.trim()) {
                    e.preventDefault();
                    setKeyTakeaways([...keyTakeaways, newTakeaway.trim()]);
                    setNewTakeaway('');
                  }
                }}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
              <button
                type="button"
                onClick={() => {
                  if (newTakeaway.trim()) {
                    setKeyTakeaways([...keyTakeaways, newTakeaway.trim()]);
                    setNewTakeaway('');
                  }
                }}
                className="px-3 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {keyTakeaways.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setKeyTakeaways(keyTakeaways.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Related Topics Editor */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Related Topics & References</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="e.g. Sliding Window, LRU Cache, Two Sum..."
                value={newRelated}
                onChange={(e) => setNewRelated(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newRelated.trim()) {
                    e.preventDefault();
                    setRelatedTopics([...relatedTopics, newRelated.trim()]);
                    setNewRelated('');
                  }
                }}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
              <button
                type="button"
                onClick={() => {
                  if (newRelated.trim()) {
                    setRelatedTopics([...relatedTopics, newRelated.trim()]);
                    setNewRelated('');
                  }
                }}
                className="px-3 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {relatedTopics.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100"
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => setRelatedTopics(relatedTopics.filter((_, i) => i !== idx))}
                    className="hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Diagrams & Handwritten Notes Upload */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Diagrams & Handwritten Notes</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload sketches, system architecture drawings, whiteboard photos, or hand-written notes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Images</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {images.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-xs text-slate-400">
                No diagrams or handwritten notes uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <img src={img.url} alt={img.caption || 'Topic Image'} className="w-full h-48 object-contain bg-white" />
                    <div className="p-2.5 flex items-center justify-between gap-2 border-t border-slate-200">
                      <input
                        type="text"
                        value={img.caption || ''}
                        onChange={(e) => handleUpdateImageCaption(img.id, e.target.value)}
                        placeholder="Image caption..."
                        className="text-xs bg-white border border-slate-200 px-2 py-1 rounded flex-1 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* READING MODE - Distraction free */
        <div className="space-y-6">
          {/* Main Content Area */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-8 shadow-xs">
            {!markdown && keyTakeaways.length === 0 && images.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">Coming Soon — Detailed Notes</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                  Comprehensive topic notes, diagrams, code examples, and interview takeaways are being prepared for this module.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Key Takeaways Box */}
                {keyTakeaways.length > 0 && (
                  <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-5 notes-handwritten-scope">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-3 flex items-center gap-1.5">
                      <Bookmark className="w-4 h-4 text-sky-600" />
                      Important Concepts & Key Takeaways
                    </h3>
                    <ul className="space-y-2">
                      {keyTakeaways.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                          <span>{renderTakeaway(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interactive Visual Learning Roadmap (Flowchart instead of TOC) */}
                <LearningFlowchart topicId={topic.id} topicTitle={topic.title} markdownContent={markdown} />

                {/* Markdown Notes Text */}
                {markdown && (
                  <div className="pt-2 w-full max-w-full min-w-0 overflow-hidden">
                    <MarkdownRenderer content={markdown} />
                  </div>
                )}

                {/* Diagrams & Handwritten Notes Gallery */}
                {images.length > 0 && (
                  <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">
                      Handwritten Notes & Architecture Diagrams
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {images.map((img) => (
                        <div key={img.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                          <img
                            src={img.url}
                            alt={img.caption || 'Topic Diagram'}
                            className="w-full max-h-96 object-contain bg-white cursor-pointer hover:opacity-95 transition-opacity"
                            onClick={() => window.open(img.url, '_blank')}
                          />
                          {img.caption && (
                            <div className="p-3 bg-white border-t border-slate-100 text-xs font-medium text-slate-600 text-center">
                              {img.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Topics Pill Tags */}
                {relatedTopics.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-400">Related:</span>
                    {relatedTopics.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <BackToTop scrollThreshold={400} />
    </div>
  );
};
