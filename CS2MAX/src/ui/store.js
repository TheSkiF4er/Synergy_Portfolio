/**
 * Минимальный state-driven store без зависимостей.
 *
 * @template S
 * @template A
 * @param {S} initialState
 * @param {(state: S, action: A) => S} reducer
 */
export function createStore(initialState, reducer) {
  /** @type {S} */
  let state = initialState;

  /** @type {Set<(s: S) => void>} */
  const listeners = new Set();

  return {
    /** @returns {S} */
    getState() {
      return state;
    },

    /** @param {A} action */
    dispatch(action) {
      const next = reducer(state, action);
      if (next === state) return;

      state = next;
      for (const l of listeners) l(state);
    },

    /**
     * @param {(s: S) => void} listener
     * @returns {() => void} unsubscribe
     */
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
