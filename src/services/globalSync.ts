import { collection, doc, getDocs, onSnapshot, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { StorageService } from './storage';
import { DailyActivity, DailyGoal, Track } from '../types';
import { globalProgressStore } from '../stores/globalProgressStore';

const root = ['global', 'preptoplace'] as const;
const tracksRef = collection(db, ...root, 'tracks');
const activitiesRef = collection(db, ...root, 'studySessions');
const goalsRef = collection(db, ...root, 'dailyGoals');
const progressRef = collection(db, ...root, 'progress', 'topics', 'records');
const flowchartProgressRef = collection(db, ...root, 'progress', 'flowcharts', 'records');
const stateRef = doc(db, ...root, 'metadata', 'state');
const changeEvent = 'preptoplace:local-data-changed';
const trackBaseline = new Map<string, Track>();
const progressOverrides = new Map<string, { trackSlug: string; status: string; lastStudied?: string | null }>();

function applyProgressOverrides(tracks: Track[]): Track[] {
  const visit = (track: Track, sections: any[]) => sections.forEach(section => {
    (section.topics || []).forEach((topic: any) => {
      const progress = progressOverrides.get(topic.id);
      if (progress?.trackSlug === track.slug) {
        topic.status = progress.status;
        if (progress.lastStudied) topic.lastStudied = progress.lastStudied;
      }
    });
    if (section.subsections) visit(track, section.subsections);
  });
  tracks.forEach(track => visit(track, track.sections));
  return tracks;
}

function mergeMissingRegisteredNotes(remoteTrack: Track, localTrack?: Track): { track: Track; changed: boolean } {
  if (!localTrack) return { track: remoteTrack, changed: false };
  const merged = JSON.parse(JSON.stringify(remoteTrack)) as Track;
  let changed = false;

  const mergeSections = (remoteSections: Track['sections'], localSections: Track['sections']) => {
    remoteSections.forEach(remoteSection => {
      const localSection = localSections.find(section => section.id === remoteSection.id || section.title === remoteSection.title);
      if (!localSection) return;

      (remoteSection.topics || []).forEach(remoteTopic => {
        const localTopic = (localSection.topics || []).find(topic => topic.id === remoteTopic.id);
        if (!remoteTopic.note && localTopic?.note?.markdown?.trim()) {
          remoteTopic.note = localTopic.note;
          changed = true;
        }
      });

      if (remoteSection.subsections?.length && localSection.subsections?.length) {
        mergeSections(remoteSection.subsections, localSection.subsections);
      }
    });
  };

  mergeSections(merged.sections || [], localTrack.sections || []);
  return { track: merged, changed };
}

async function syncRegisteredNotes(trackSlug: string, localTrack: Track): Promise<void> {
  const ref = doc(tracksRef, trackSlug);
  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists()) return;

    const remote = snapshot.data() as Track & { updatedAt?: unknown; migratedAt?: unknown };
    delete remote.updatedAt;
    delete remote.migratedAt;
    const merged = mergeMissingRegisteredNotes(remote, localTrack);
    if (merged.changed) {
      transaction.set(ref, { ...merged.track, updatedAt: serverTimestamp() });
    }
  });
}

function same(a: unknown, b: unknown) { return JSON.stringify(a) === JSON.stringify(b); }
function mergeConcurrent(base: any, local: any, remote: any, path = 'track'): any {
  // Notes are registered from bundled markdown and may be present in local cache
  // and Firestore with identical content but independently generated metadata.
  // Merge that safe case instead of treating metadata timestamps as a conflict.
  if (path.endsWith('.note') && local && remote &&
      local.id === remote.id && local.topicId === remote.topicId &&
      local.markdown === remote.markdown) {
    const mergeItems = (left: any[] = [], right: any[] = []) => {
      const items = new Map<string, any>();
      [...left, ...right].forEach(item => {
        const key = item?.id ?? JSON.stringify(item);
        items.set(String(key), { ...items.get(String(key)), ...item });
      });
      return [...items.values()];
    };
    const localUpdated = Date.parse(local.lastUpdated || '');
    const remoteUpdated = Date.parse(remote.lastUpdated || '');
    const latestUpdate = Number.isFinite(localUpdated) && localUpdated > remoteUpdated
      ? local.lastUpdated
      : remote.lastUpdated ?? local.lastUpdated;
    return {
      ...local,
      ...remote,
      keyTakeaways: [...new Set([...(local.keyTakeaways || []), ...(remote.keyTakeaways || [])])],
      relatedTopics: [...new Set([...(local.relatedTopics || []), ...(remote.relatedTopics || [])])],
      images: mergeItems(local.images, remote.images),
      lastUpdated: latestUpdate,
    };
  }
  if (same(local, base)) return remote;
  if (same(remote, base) || same(local, remote)) return local;
  if (path.endsWith('.resources') && Array.isArray(local) && Array.isArray(remote)) {
    // Resource lists can be edited independently in multiple visitors' caches.
    // Preserve both sides' entries on a true concurrent change; dedupe identical
    // links without allowing one visitor's catalog snapshot to erase another's.
    const resources = new Map<string, any>();
    [...local, ...remote].forEach(resource => {
      const key = resource && typeof resource === 'object'
        ? `${resource.title || ''}\u0000${resource.url || ''}`
        : JSON.stringify(resource);
      resources.set(key, resource);
    });
    return [...resources.values()];
  }
  if (Array.isArray(base) && Array.isArray(local) && Array.isArray(remote) && [...base, ...local, ...remote].every(v => v && typeof v === 'object' && 'id' in v)) {
    const maps = [base, local, remote].map(values => new Map(values.map((v: any) => [v.id, v])));
    const ids = new Set([...maps[0].keys(), ...maps[1].keys(), ...maps[2].keys()]);
    return [...ids].flatMap(id => {
      const merged = mergeConcurrent(maps[0].get(id), maps[1].get(id), maps[2].get(id), `${path}.${String(id)}`);
      return merged === undefined ? [] : [merged];
    });
  }
  if (base && local && remote && !Array.isArray(base) && !Array.isArray(local) && !Array.isArray(remote) && typeof base === 'object' && typeof local === 'object' && typeof remote === 'object') {
    const result: Record<string, unknown> = {};
    for (const key of new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)])) {
      const value = mergeConcurrent(base[key], local[key], remote[key], `${path}.${key}`);
      if (value !== undefined) result[key] = value;
    }
    return result;
  }
  throw new Error(`Concurrent edit conflict at ${path}; refresh before retrying.`);
}

/** Global, unauthenticated shared dataset. Local storage remains the offline cache. */
export function startGlobalSync(onStatus: (status: { loading: boolean; error: string | null }) => void = () => {}) {
  let ready = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  const reportError = (error: Error) => onStatus({ loading: !ready, error: error.message });

  const syncLocalChanges = () => {
    if (!ready || stopped) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        const tracks = StorageService.getTracks();
        const activities = StorageService.getActivities();
        const goals: Record<string, DailyGoal> = JSON.parse(localStorage.getItem(StorageService.cloudKeys.GOALS) || '{}');
        await Promise.all([
          ...tracks.map(async track => {
            const baseline = trackBaseline.get(track.slug);
            const ref = doc(tracksRef, track.slug);
            if (!baseline) return setDoc(ref, { ...track, updatedAt: serverTimestamp() }, { merge: true });
            return runTransaction(db, async tx => {
              const snap = await tx.get(ref);
              if (!snap.exists()) { tx.set(ref, { ...track, updatedAt: serverTimestamp() }); return; }
              const remote = snap.data() as Track & { updatedAt?: unknown };
              delete remote.updatedAt;
              const merged = mergeConcurrent(baseline, track, remote);
              tx.set(ref, { ...merged, updatedAt: serverTimestamp() });
            });
          }),
          ...activities.map(activity => setDoc(doc(activitiesRef, activity.id), { ...activity, updatedAt: serverTimestamp() })),
          ...Object.values(goals).map(goal => setDoc(doc(goalsRef, goal.date), { ...goal, updatedAt: serverTimestamp() })),
        ]);
        onStatus({ loading: false, error: null });
      } catch (error) { reportError(error instanceof Error ? error : new Error('Global sync failed')); }
    }, 500);
  };
  window.addEventListener(changeEvent, syncLocalChanges);

  const handleProgressChange = async (event: Event) => {
    const record = (event as CustomEvent).detail as { topicId: string; trackSlug: string; sectionId: string; status: string; previousStatus: string; lastStudied?: string };
    try {
      await runTransaction(db, async tx => {
        const ref = doc(progressRef, record.topicId);
        const { previousStatus: _previousStatus, ...progress } = record;
        tx.set(ref, { ...progress, updatedAt: serverTimestamp() });
      });
      onStatus({ loading: false, error: null });
    } catch (error) {
      const track = StorageService.getTrackBySlug(record.trackSlug);
      if (track) StorageService.updateTopic(track.id, record.topicId, { status: record.previousStatus as any }, false);
      globalProgressStore.publish({ error: error instanceof Error ? error.message : 'Progress save failed' });
    }
  };
  window.addEventListener('preptoplace:progress-changed', handleProgressChange);

  const handleFlowchartProgressChange = async (event: Event) => {
    const record = (event as CustomEvent).detail as { topicId: string; nodeId: string; completed: boolean; previousCompleted: boolean };
    const ref = doc(flowchartProgressRef, `${record.topicId}__${record.nodeId}`);
    try {
      await runTransaction(db, async tx => {
        tx.set(ref, { topicId: record.topicId, nodeId: record.nodeId, completed: record.completed, updatedAt: serverTimestamp() });
      });
    } catch (error) {
      globalProgressStore.setFlowchartNode(record.topicId, record.nodeId, record.previousCompleted);
      globalProgressStore.publish({ error: error instanceof Error ? error.message : 'Flowchart progress save failed' });
    }
  };
  window.addEventListener('preptoplace:flowchart-progress-changed', handleFlowchartProgressChange);

  const unsubProgress = onSnapshot(progressRef, snapshot => {
    progressOverrides.clear();
    snapshot.docs.forEach(item => {
      const progress = item.data();
      progressOverrides.set(progress.topicId, {
        trackSlug: progress.trackSlug,
        status: progress.status,
        lastStudied: progress.lastStudied ?? null,
      });
    });
    const tracks = StorageService.getTracks();
    let changed = false;
    const overridden = applyProgressOverrides(tracks);
    changed = progressOverrides.size > 0;
    if (changed) StorageService.applyCloudSnapshot({ tracks: overridden });
    globalProgressStore.publish({ ready: true, error: null });
  }, error => { reportError(error); globalProgressStore.publish({ error: error.message }); });
  const unsubFlowchartProgress = onSnapshot(flowchartProgressRef, snapshot => {
    globalProgressStore.setFlowchartSnapshot(snapshot.docs.map(item => item.data() as { topicId: string; nodeId: string; completed: boolean }));
  }, error => { reportError(error); globalProgressStore.publish({ error: error.message }); });

  const unsubTracks = onSnapshot(tracksRef, { includeMetadataChanges: true }, snapshot => {
    if (snapshot.metadata.fromCache) {
      onStatus({ loading: true, error: null });
      return;
    }
    const localTracks = new Map(StorageService.getTracks().map(track => [track.slug, track]));
    const registeredNotesToSync = new Map<string, Track>();
    const tracks = snapshot.docs.map(item => {
      const data = item.data() as Track & { updatedAt?: unknown; migratedAt?: unknown };
      delete data.updatedAt; delete data.migratedAt;
      const base = trackBaseline.get(data.slug);
      const local = localTracks.get(data.slug);
      let visible = data;
      if (base && local && !same(base, local)) {
        try { visible = mergeConcurrent(base, local, data); }
        catch (error) {
          reportError(error instanceof Error ? error : new Error('Concurrent edit conflict'));
          visible = local;
        }
      }
      const notesMerge = mergeMissingRegisteredNotes(visible, local);
      visible = notesMerge.track;
      if (notesMerge.changed && local) registeredNotesToSync.set(data.slug, local);
      trackBaseline.set(data.slug, JSON.parse(JSON.stringify(data)) as Track);
      return visible;
    });
    if (tracks.length) StorageService.applyCloudSnapshot({ tracks: applyProgressOverrides(tracks) });
    globalProgressStore.publish({ ready: true });
    if (registeredNotesToSync.size) {
      void Promise.all([...registeredNotesToSync].map(([slug, track]) => syncRegisteredNotes(slug, track)))
        .catch(error => reportError(error instanceof Error ? error : new Error('Registered notes sync failed')));
    }
    if (!ready) {
      ready = true;
      onStatus({ loading: false, error: null });
      void Promise.all([getDocs(tracksRef), getDocs(activitiesRef), getDocs(goalsRef)]).then(([cloudTracks, cloudActivities, cloudGoals]) =>
      runTransaction(db, async transaction => {
        const marker = await transaction.get(stateRef);
        if (marker.exists() || cloudTracks.size + cloudActivities.size + cloudGoals.size > 0) return false;
        transaction.set(stateRef, { migratedAt: serverTimestamp(), source: 'localStorage-v4' });
        return true;
      })).then(async shouldImport => {
        if (!shouldImport) return;
        // Import existing browser data only if this installation established the global dataset.
        const localTracks = StorageService.getTracks();
        const localActivities = StorageService.getActivities();
        const localGoals: Record<string, DailyGoal> = JSON.parse(localStorage.getItem(StorageService.cloudKeys.GOALS) || '{}');
        await Promise.all([
          ...localTracks.map(track => setDoc(doc(tracksRef, track.slug), { ...track, migratedAt: serverTimestamp() }, { merge: true })),
          ...localTracks.flatMap(track => {
            const records: Array<Promise<void>> = [];
            const visit = (sections: any[]) => sections.forEach(section => {
              (section.topics || []).forEach((topic: any) => records.push(setDoc(doc(progressRef, topic.id), {
                topicId: topic.id, trackSlug: track.slug, sectionId: section.id,
                status: topic.status, lastStudied: topic.lastStudied || null, updatedAt: serverTimestamp()
              }, { merge: true })));
              if (section.subsections) visit(section.subsections);
            });
            visit(track.sections);
            return records;
          }),
          ...localActivities.map(activity => setDoc(doc(activitiesRef, activity.id), { ...activity, migratedAt: serverTimestamp() }, { merge: true })),
          ...Object.values(localGoals).map(goal => setDoc(doc(goalsRef, goal.date), { ...goal, migratedAt: serverTimestamp() }, { merge: true })),
        ]);
      }).catch(reportError);
    }
  }, reportError);
  const unsubActivities = onSnapshot(activitiesRef, snapshot => {
    StorageService.applyCloudSnapshot({ activities: snapshot.docs.map(item => item.data() as DailyActivity) });
  }, reportError);
  const unsubGoals = onSnapshot(goalsRef, snapshot => {
    StorageService.applyCloudSnapshot({ goals: Object.fromEntries(snapshot.docs.map(item => {
      const goal = item.data() as DailyGoal; return [goal.date, goal];
    })) });
  }, reportError);

  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
    window.removeEventListener(changeEvent, syncLocalChanges);
    window.removeEventListener('preptoplace:progress-changed', handleProgressChange);
    window.removeEventListener('preptoplace:flowchart-progress-changed', handleFlowchartProgressChange);
    unsubTracks(); unsubActivities(); unsubGoals(); unsubProgress(); unsubFlowchartProgress();
  };
}
