import { Track, Topic, Section, DailyActivity, DailyGoal, TopicStatus, TrackStats, DashboardStats } from '../types';
import { INITIAL_TRACKS } from '../data/initialTracks';

const STORAGE_KEYS = {
  TRACKS: 'preptoplace_tracks_v4',
  ACTIVITIES: 'preptoplace_activities_v1',
  GOALS: 'preptoplace_goals_v1',
  USER_PROFILE: 'preptoplace_user_v1',
  MIGRATION_V3: 'preptoplace_tracks_v3_migrated',
};
const notifyDataChanged = () => window.dispatchEvent(new Event('preptoplace:local-data-changed'));
const notifyProgressChanged = (record: { topicId: string; trackSlug: string; sectionId: string; status: TopicStatus; previousStatus: TopicStatus; lastStudied?: string }) =>
  window.dispatchEvent(new CustomEvent('preptoplace:progress-changed', { detail: record }));

export class StorageService {
  static readonly cloudKeys = STORAGE_KEYS;

  /** Apply authoritative global snapshots without re-triggering cloud writes. */
  static applyCloudSnapshot(data: { tracks?: Track[]; activities?: DailyActivity[]; goals?: Record<string, DailyGoal> }): void {
    if (data.tracks) localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(data.tracks));
    if (data.activities) localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(data.activities));
    if (data.goals) localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
  }

  static getTracks(): Track[] {
    try {
      let raw = localStorage.getItem(STORAGE_KEYS.TRACKS);
      if (!raw) {
        // Check if previous versions existed and migrate
        const oldRaw = localStorage.getItem('preptoplace_tracks_v3') || localStorage.getItem('preptoplace_tracks_v2') || localStorage.getItem('preptoplace_tracks_v1');
        if (oldRaw) {
          raw = oldRaw;
        } else {
          localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(INITIAL_TRACKS));
          return INITIAL_TRACKS;
        }
      }
      const parsed: Track[] = JSON.parse(raw);
      // Migrate / seed curriculum for structured tracks
      let changed = true; // Always save back to ensure v2 has latest content
      
      // Check if we need to run one-time cleanup for AI/ML duplicate
      const hasMigrationFlag = localStorage.getItem(STORAGE_KEYS.MIGRATION_V3) === 'done';
      
      this.mergeSections(parsed, 'ai-ml');
      this.mergeSections(parsed, 'devops');
      this.mergeSections(parsed, 'system-design');

      // Sync external properties
      for (const track of parsed) {
        const init = INITIAL_TRACKS.find((it) => it.slug === track.slug);
        if (init?.isExternal !== undefined && track.isExternal !== init.isExternal) {
          track.isExternal = init.isExternal;
          track.externalUrl = init.externalUrl;
          changed = true;
        } else if (init?.externalUrl && track.externalUrl !== init.externalUrl) {
          track.externalUrl = init.externalUrl;
          changed = true;
        }
      }

      if (changed) {
        localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(parsed));
        // Mark migration as done
        if (!hasMigrationFlag) {
          localStorage.setItem(STORAGE_KEYS.MIGRATION_V3, 'done');
        }
      }
      return parsed;
    } catch {
      return INITIAL_TRACKS;
    }
  }

  // ── Private: merge new sections into a stored track without overwriting user progress ──
  private static mergeSections(parsed: Track[], slug: string): boolean {
    const stored = parsed.find((t) => t.slug === slug);
    const initial = INITIAL_TRACKS.find((t) => t.slug === slug);
    if (!stored || !initial) return false;
    if (!stored.sections || stored.sections.length === 0) {
      stored.sections = initial.sections;
      return true;
    }
    
    let changed = false;
    
    // Special cleanup for AI/ML track: remove duplicate integrated roadmap sections
    if (slug === 'ai-ml') {
      const initialIds = new Set(initial.sections.map(s => s.id));
      const beforeCount = stored.sections.length;
      stored.sections = stored.sections.filter(sec => {
        if (initialIds.has(sec.id)) {
          return true; // Keep sections that are in initial
        }
        // Remove duplicate "AI/ML & GenAI Integrated Roadmap" or orphaned sections
        if (sec.title?.includes('Integrated Roadmap') || 
            sec.title === 'AI/ML & GenAI Integrated Roadmap' || 
            sec.id === 'sec-aiml-integrated' ||
            (!sec.id.startsWith('sec-aiml-') && sec.trackId === 'track-ai-ml')) {
          changed = true;
          return false; // Remove it
        }
        return true;
      });
      if (beforeCount !== stored.sections.length) {
        changed = true;
      }
    }
    
    initial.sections.forEach((initSec) => {
      const existing = stored.sections.find((s) => s.id === initSec.id || s.title === initSec.title);
      if (!existing) {
        stored.sections.push(initSec);
        changed = true;
      } else {
        // Sync section-level properties (like isComingSoon) from initial data
        if (existing.isComingSoon !== initSec.isComingSoon) {
          existing.isComingSoon = initSec.isComingSoon;
          changed = true;
        }
        
        if (initSec.topics && initSec.topics.length > 0) {
          if (!existing.topics || existing.topics.length === 0) {
            existing.topics = initSec.topics;
            changed = true;
          } else {
            initSec.topics.forEach((initTopic) => {
              const curTopic = existing.topics?.find((t) => t.id === initTopic.id || t.title === initTopic.title);
              if (!curTopic) {
                existing.topics?.push(initTopic);
                changed = true;
              } else if (initTopic.note && !curTopic.note) {
                // Add newly registered notes to existing topic records without
                // replacing any notes already saved by the visitor.
                curTopic.note = initTopic.note;
                changed = true;
              }
              if (curTopic && !curTopic.resources?.length && initTopic.resources?.length) {
                // Seed resources on legacy topics that predate the resource catalog,
                // but retain any saved resource edits or additions.
                curTopic.resources = initTopic.resources;
                changed = true;
              }
            });
          }
        }
      }
    });
    return changed;
  }

  static saveTracks(tracks: Track[]): void {
    localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(tracks));
    notifyDataChanged();
  }

  static getTrackBySlug(slug: string): Track | undefined {
    const tracks = this.getTracks();
    return tracks.find((t) => t.slug === slug);
  }

  // Section Management
  static addSection(trackId: string, sectionData: Omit<Section, 'id' | 'subsections' | 'topics'>): Section {
    const tracks = this.getTracks();
    const track = tracks.find((t) => t.id === trackId || t.slug === trackId);
    if (!track) throw new Error('Track not found');

    const newSection: Section = {
      ...sectionData,
      id: 'sec-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      subsections: [],
      topics: [],
    };

    if (sectionData.parentId) {
      // Find parent section recursively
      const addNested = (sections: Section[]): boolean => {
        for (const sec of sections) {
          if (sec.id === sectionData.parentId) {
            sec.subsections = sec.subsections || [];
            sec.subsections.push(newSection);
            return true;
          }
          if (sec.subsections && addNested(sec.subsections)) return true;
        }
        return false;
      };
      addNested(track.sections);
    } else {
      track.sections.push(newSection);
    }

    this.saveTracks(tracks);
    return newSection;
  }

  static updateSection(trackId: string, sectionId: string, updates: Partial<Section>): void {
    const tracks = this.getTracks();
    const track = tracks.find((t) => t.id === trackId || t.slug === trackId);
    if (!track) return;

    const updateRecursive = (sections: Section[]): boolean => {
      for (const sec of sections) {
        if (sec.id === sectionId) {
          Object.assign(sec, updates);
          return true;
        }
        if (sec.subsections && updateRecursive(sec.subsections)) return true;
      }
      return false;
    };

    updateRecursive(track.sections);
    this.saveTracks(tracks);
  }

  static deleteSection(trackId: string, sectionId: string): void {
    const tracks = this.getTracks();
    const track = tracks.find((t) => t.id === trackId || t.slug === trackId);
    if (!track) return;

    const deleteRecursive = (sections: Section[]): boolean => {
      const idx = sections.findIndex((s) => s.id === sectionId);
      if (idx !== -1) {
        sections.splice(idx, 1);
        return true;
      }
      for (const sec of sections) {
        if (sec.subsections && deleteRecursive(sec.subsections)) return true;
      }
      return false;
    };

    deleteRecursive(track.sections);
    this.saveTracks(tracks);
  }

  // Topic Management
  static addTopic(trackId: string, sectionId: string, title: string): Topic {
    const tracks = this.getTracks();
    const track = tracks.find((t) => t.id === trackId || t.slug === trackId);
    if (!track) throw new Error('Track not found');

    const newTopic: Topic = {
      id: 'top-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      sectionId,
      title,
      order: 0,
      status: 'NOT_STARTED',
      createdAt: new Date().toISOString(),
      note: {
        id: 'note-' + Date.now(),
        topicId: '',
        markdown: '',
        keyTakeaways: [],
        relatedTopics: [],
        images: [],
        lastUpdated: new Date().toISOString(),
      },
    };
    newTopic.note!.topicId = newTopic.id;

    const findAndAdd = (sections: Section[]): boolean => {
      for (const sec of sections) {
        if (sec.id === sectionId) {
          sec.topics = sec.topics || [];
          newTopic.order = sec.topics.length + 1;
          sec.topics.push(newTopic);
          return true;
        }
        if (sec.subsections && findAndAdd(sec.subsections)) return true;
      }
      return false;
    };

    findAndAdd(track.sections);
    this.saveTracks(tracks);
    return newTopic;
  }

  static updateTopic(trackId: string, topicId: string, updates: Partial<Topic>, syncProgress = true): void {
    const tracks = this.getTracks();
    const track = tracks.find((t) => t.id === trackId || t.slug === trackId);
    if (!track) return;
    const previousStatus = this.getTopicById(topicId)?.topic.status || 'NOT_STARTED';

    const findAndUpdate = (sections: Section[]): boolean => {
      for (const sec of sections) {
        if (sec.topics) {
          const t = sec.topics.find((item) => item.id === topicId);
          if (t) {
            Object.assign(t, updates);
            if (updates.status) {
              t.lastStudied = new Date().toISOString().split('T')[0];
            }
            return true;
          }
        }
        if (sec.subsections && findAndUpdate(sec.subsections)) return true;
      }
      return false;
    };

    const section = track.sections;
    let sectionId = '';
    const findSection = (sections: Section[]): boolean => {
      for (const sec of sections) {
        if (sec.topics?.some(topic => topic.id === topicId)) { sectionId = sec.id; return true; }
        if (sec.subsections && findSection(sec.subsections)) return true;
      }
      return false;
    };
    findSection(section);
    findAndUpdate(track.sections);
    if (updates.status) {
      localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(tracks));
      if (syncProgress) {
        const topic = this.getTopicById(topicId)?.topic;
        notifyProgressChanged({ topicId, trackSlug: track.slug, sectionId, status: updates.status, previousStatus, lastStudied: topic?.lastStudied });
      }
      return;
    }
    this.saveTracks(tracks);
  }

  static deleteTopic(trackId: string, topicId: string): void {
    const tracks = this.getTracks();
    const track = tracks.find((t) => t.id === trackId || t.slug === trackId);
    if (!track) return;

    const findAndDelete = (sections: Section[]): boolean => {
      for (const sec of sections) {
        if (sec.topics) {
          const idx = sec.topics.findIndex((t) => t.id === topicId);
          if (idx !== -1) {
            sec.topics.splice(idx, 1);
            return true;
          }
        }
        if (sec.subsections && findAndDelete(sec.subsections)) return true;
      }
      return false;
    };

    findAndDelete(track.sections);
    this.saveTracks(tracks);
  }

  static getTopicById(topicId: string): { topic: Topic; track: Track; sectionTitle: string } | null {
    const tracks = this.getTracks();
    for (const track of tracks) {
      const searchSections = (sections: Section[]): { topic: Topic; track: Track; sectionTitle: string } | null => {
        for (const sec of sections) {
          if (sec.topics) {
            const found = sec.topics.find((t) => t.id === topicId);
            if (found) {
              return { topic: found, track, sectionTitle: sec.title };
            }
          }
          if (sec.subsections) {
            const res = searchSections(sec.subsections);
            if (res) return res;
          }
        }
        return null;
      };
      const result = searchSections(track.sections);
      if (result) return result;
    }
    return null;
  }

  // Activities & Tracker
  static getActivities(): DailyActivity[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // Daily Goal
  static getGoal(dateStr: string): DailyGoal {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
      const goals: Record<string, DailyGoal> = raw ? JSON.parse(raw) : {};
      return goals[dateStr] || {
        date: dateStr,
        targetMinutes: 120,
        targetTopics: 2,
        isCompleted: false,
      };
    } catch {
      return {
        date: dateStr,
        targetMinutes: 120,
        targetTopics: 2,
        isCompleted: false,
      };
    }
  }

  // Statistics Computations
  static getAllTopics(track?: Track): Topic[] {
    const topics: Topic[] = [];
    const extract = (sections: Section[]) => {
      for (const sec of sections) {
        if (sec.topics) topics.push(...sec.topics);
        if (sec.subsections) extract(sec.subsections);
      }
    };
    if (track) {
      extract(track.sections);
    } else {
      const tracks = this.getTracks().filter(
        (t) => !t.isExternal && t.slug !== 'dsa' && t.slug !== 'core-subjects' && t.slug !== 'development'
      );
      for (const t of tracks) extract(t.sections);
    }
    return topics;
  }

  static getTrackStats(track: Track): TrackStats {
    const topics = this.getAllTopics(track);
    const total = topics.length;
    const completed = topics.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = topics.filter((t) => t.status === 'IN_PROGRESS').length;
    const needsRevision = topics.filter((t) => t.status === 'NEEDS_REVISION').length;
    const pending = total - completed;

    // Get last studied date
    const lastStudied = topics
      .filter((t) => t.lastStudied)
      .map((t) => t.lastStudied as string)
      .sort()
      .pop();

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      totalTopics: total,
      completedTopics: completed,
      inProgressTopics: inProgress,
      needsRevisionTopics: needsRevision,
      pendingTopics: pending,
      progressPercentage: percentage,
      lastStudiedDate: lastStudied,
      estimatedHours: track.estimatedHours,
    };
  }

  static getSectionStats(section: Section) {
    const topics: Topic[] = [];
    const extract = (sec: Section) => {
      if (sec.topics) topics.push(...sec.topics);
      if (sec.subsections) sec.subsections.forEach(extract);
    };
    extract(section);

    const total = topics.length;
    const completed = topics.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = topics.filter((t) => t.status === 'IN_PROGRESS').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      percentage,
      pending: total - completed,
    };
  }

  static getDashboardStats(): DashboardStats {
    const tracks = this.getTracks();
    const allTopics = this.getAllTopics();
    const total = allTopics.length;
    const completed = allTopics.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = allTopics.filter((t) => t.status === 'IN_PROGRESS').length;
    const pending = total - completed;
    const overallPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const activities = this.getActivities();
    const totalMinutes = activities.reduce((acc, curr) => acc + (curr.minutesSpent || 0), 0);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

    // Today's stats
    const todayStr = new Date().toISOString().split('T')[0];
    const todayActs = activities.filter((a) => a.date === todayStr);
    const todayMinutes = todayActs.reduce((acc, curr) => acc + (curr.minutesSpent || 0), 0);
    const todayCompletedCount = todayActs.reduce((acc, curr) => acc + (curr.topicsCompleted || 0), 0);

    // Calculate streaks
    const distinctDates = Array.from(new Set(activities.map((a) => a.date))).sort().reverse();
    let currentStreak = 0;
    let longestStreak = 0;

    if (distinctDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const firstDate = new Date(distinctDates[0] + 'T00:00:00');
      const isTodayOrYesterday =
        firstDate.getTime() === today.getTime() || firstDate.getTime() === yesterday.getTime();

      if (isTodayOrYesterday) {
        let checkDate = firstDate;
        for (let i = 0; i < distinctDates.length; i++) {
          const d = new Date(distinctDates[i] + 'T00:00:00');
          const diffDays = Math.round((checkDate.getTime() - d.getTime()) / (1000 * 3600 * 24));
          if (diffDays <= 1) {
            currentStreak++;
            checkDate = d;
          } else {
            break;
          }
        }
      }
      longestStreak = Math.max(currentStreak, distinctDates.length > 0 ? 1 : 0);
    }

    return {
      totalTracks: tracks.length,
      totalTopics: total,
      completedTopics: completed,
      inProgressTopics: inProgress,
      pendingTopics: pending,
      overallPercentage,
      totalLearningHours: totalHours,
      currentStreak,
      longestStreak,
      todayMinutes,
      todayCompletedCount,
    };
  }

  // Global Search
  static globalSearch(query: string) {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: Array<{
      type: 'track' | 'section' | 'topic' | 'note';
      title: string;
      subtitle: string;
      link: string;
    }> = [];

    const tracks = this.getTracks();
    for (const track of tracks) {
      if (track.name.toLowerCase().includes(q) || track.description.toLowerCase().includes(q)) {
        results.push({
          type: 'track',
          title: track.name,
          subtitle: `Track • ${track.description.slice(0, 70)}...`,
          link: `/tracks/${track.slug}`,
        });
      }

      const searchSections = (sections: Section[]) => {
        for (const sec of sections) {
          if (sec.title.toLowerCase().includes(q)) {
            results.push({
              type: 'section',
              title: sec.title,
              subtitle: `Section in ${track.name}`,
              link: `/tracks/${track.slug}`,
            });
          }
          if (sec.topics) {
            for (const top of sec.topics) {
              if (top.title.toLowerCase().includes(q)) {
                results.push({
                  type: 'topic',
                  title: top.title,
                  subtitle: `Topic in ${track.name} > ${sec.title}`,
                  link: `/topics/${top.id}`,
                });
              }
              if (top.note && top.note.markdown.toLowerCase().includes(q)) {
                results.push({
                  type: 'note',
                  title: `Notes: ${top.title}`,
                  subtitle: `Notes matched search query`,
                  link: `/topics/${top.id}`,
                });
              }
            }
          }
          if (sec.subsections) searchSections(sec.subsections);
        }
      };

      searchSections(track.sections);
    }

    return results.slice(0, 10);
  }
}
