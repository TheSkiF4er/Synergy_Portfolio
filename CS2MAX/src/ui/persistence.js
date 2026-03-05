/**
 * Persistence слой: localStorage (изолирован от бизнес-логики и DOM).
 *
 * single source of truth: store/state
 * localStorage — только snapshot/кэш.
 */

const STORAGE_KEY = 'counter_state_v1';

/**
 * @template T
 * @param {string} key
 * @returns {T | null}
 */
export function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return /** @type {T} */ (JSON.parse(raw));
  } catch {
    return null;
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 */
export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / privacy mode
  }
}

/**
 * @returns {string}
 */
export function getStateStorageKey() {
  return STORAGE_KEY;
}
