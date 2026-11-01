/**
 * Centralized track ordering configuration for consistent display across PrepToPlace.
 * This ensures the same six-track order everywhere: internal tracks first, external tracks last.
 */

export const TRACK_ORDER = [
  'ai-ml',
  'system-design',
  'devops',
  'dsa',
  'development',
  'core-subjects',
];

export const EXTERNAL_TRACKS = new Set([
  'dsa',
  'development',
  'core-subjects',
]);

/**
 * Checks if a track is external.
 * A track is external if it's in the EXTERNAL_TRACKS set OR explicitly marked with isExternal flag.
 */
export const isExternalTrack = (slug: string, isExternalFlag?: boolean): boolean => {
  return isExternalFlag || EXTERNAL_TRACKS.has(slug);
};

/**
 * Gets the sort order index for a track based on its slug.
 * Used for consistent sorting across all views.
 */
export const getTrackOrderIndex = (slug: string): number => {
  const index = TRACK_ORDER.indexOf(slug);
  return index === -1 ? TRACK_ORDER.length : index;
};

/**
 * Sorts an array of tracks according to the standard order.
 */
export const sortTracksByOrder = <T extends { slug: string }>(tracks: T[]): T[] => {
  return [...tracks].sort(
    (a, b) => getTrackOrderIndex(a.slug) - getTrackOrderIndex(b.slug)
  );
};
