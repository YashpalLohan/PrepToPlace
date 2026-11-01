/**
 * Utility for determining if notes are available for a topic.
 * This provides a single source of truth for notes availability checks.
 */

import { Topic } from '../types';

/**
 * Check if a topic has valid, available notes.
 * 
 * Returns true only if:
 * - The topic has a `note` object
 * - The markdown content is non-empty after trimming
 * - The markdown is not a placeholder like "Coming Soon"
 * 
 * @param topic - The topic to check
 * @returns true if notes are available and not just a placeholder
 */
export function hasNotesAvailable(topic: Topic | undefined): boolean {
  if (!topic || !topic.note) {
    return false;
  }

  const markdown = topic.note.markdown?.trim() || '';
  const hasRealMarkdown = markdown.length >= 20 && !/^\s*(coming soon|notes are being prepared)\b/i.test(markdown);
  const hasGeneratedTakeaways = Boolean(topic.note.keyTakeaways?.some(value => value.trim().length > 0));
  const hasSavedDiagrams = Boolean(topic.note.images?.some(image => image.url?.trim()));
  return hasRealMarkdown || hasGeneratedTakeaways || hasSavedDiagrams;
}

/**
 * Get a description of why notes are unavailable (for tooltips/messages).
 * 
 * @param topic - The topic to describe
 * @returns A user-friendly message
 */
export function getNotesUnavailableReason(topic: Topic | undefined): string {
  if (!topic) {
    return 'Topic not found';
  }

  if (!topic.note) {
    return 'Notes are not available yet.';
  }

  const markdown = topic.note.markdown?.trim() || '';
  if (!markdown) {
    return 'Notes are not available yet.';
  }

  if (markdown.length < 20) {
    return 'Notes are not available yet.';
  }

  return 'Notes are not available yet.';
}
