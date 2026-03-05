/**
 * История вычислений (в памяти + localStorage).
 */

const STORAGE_KEY = "calc_history_v1";
const MAX_ITEMS = 30;

/**
 * @typedef {Object} HistoryItem
 * @property {string} id
 * @property {string} expression
 * @property {string} result
 * @property {number} ts
 */

/** @returns {HistoryItem[]} */
export function loadHistory() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.slice(0, MAX_ITEMS);
    } catch {
        return [];
    }
}

/**
 * @param {HistoryItem[]} items
 */
export function saveHistory(items) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
    } catch {
        // localStorage может быть недоступен (например, в приватном режиме)
    }
}

/**
 * @param {HistoryItem[]} items
 * @param {Omit<HistoryItem, 'id' | 'ts'> & Partial<Pick<HistoryItem, 'id' | 'ts'>>} item
 * @returns {HistoryItem[]}
 */
export function addHistoryItem(items, item) {
    const id = item.id ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const ts = item.ts ?? Date.now();
    const next = [{ id, ts, ...item }, ...items].slice(0, MAX_ITEMS);
    saveHistory(next);
    return next;
}

export function clearHistory() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
}
