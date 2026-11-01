import { useSyncExternalStore } from 'react';

export interface GlobalProgressState { revision: number; ready: boolean; error: string | null; flowchartCompletions: Record<string, string[]>; }
let state: GlobalProgressState = { revision: 0, ready: false, error: null, flowchartCompletions: {} };
const listeners = new Set<() => void>();
export const globalProgressStore = {
  getSnapshot: () => state,
  subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener); },
  publish(patch: Partial<GlobalProgressState> = {}) {
    state = { ...state, ...patch, revision: state.revision + 1 };
    listeners.forEach(listener => listener());
  },
  setFlowchartNode(topicId: string, nodeId: string, completed: boolean) {
    const current = new Set(state.flowchartCompletions[topicId] || []);
    if (completed) current.add(nodeId); else current.delete(nodeId);
    state = { ...state, flowchartCompletions: { ...state.flowchartCompletions, [topicId]: [...current] }, revision: state.revision + 1 };
    listeners.forEach(listener => listener());
  },
  setFlowchartSnapshot(records: Array<{ topicId: string; nodeId: string; completed: boolean }>) {
    const grouped: Record<string, string[]> = {};
    records.forEach(record => { if (record.completed) (grouped[record.topicId] ||= []).push(record.nodeId); });
    state = { ...state, flowchartCompletions: grouped, ready: true, error: null, revision: state.revision + 1 };
    listeners.forEach(listener => listener());
  }
};
export function useGlobalProgress() {
  return useSyncExternalStore(globalProgressStore.subscribe, globalProgressStore.getSnapshot, globalProgressStore.getSnapshot);
}
