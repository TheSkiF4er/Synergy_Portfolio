/**
 * Minimal observer/event-bus implementation.
 * Lets UI subscribe to calculator events without coupling modules.
 */
class EventBus {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this.listeners = new Map();
  }

  /**
   * @param {string} event
   * @param {(payload:any)=>void} handler
   */
  on(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  /**
   * @param {string} event
   * @param {(payload:any)=>void} handler
   */
  off(event, handler) {
    const set = this.listeners.get(event);
    if (set) set.delete(handler);
  }

  /**
   * @param {string} event
   * @param {any} payload
   */
  emit(event, payload) {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const fn of set) {
      try { fn(payload); } catch (_) { /* ignore listener errors */ }
    }
  }
}

module.exports = { EventBus };
