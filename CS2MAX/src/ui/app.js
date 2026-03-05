import { createStore } from './store.js';
import { initialState, reducer, MAX_COUNT, MIN_COUNT, validateState } from '../business/counter.js';
import { getStateStorageKey, readJson, writeJson } from './persistence.js';
import { render } from './render.js';
import { bindHandlers } from './handlers.js';

/**
 * UI слой: связывает store и DOM.
 * Главный принцип — DOM является функцией состояния: render(state).
 */

/** @typedef {import('../business/counter.js').CounterState} CounterState */

/**
 * @returns {{
 *  resultEl: HTMLElement,
 *  messageEl: HTMLElement,
 *  plusBtn: HTMLButtonElement,
 *  minusBtn: HTMLButtonElement,
 *  srStatusEl: HTMLElement
 * }}
 */
function getDom() {
  const resultEl = /** @type {HTMLElement} */ (document.getElementById('result'));
  const messageEl = /** @type {HTMLElement} */ (document.getElementById('message'));
  const plusBtn = /** @type {HTMLButtonElement} */ (document.getElementById('plus'));
  const minusBtn = /** @type {HTMLButtonElement} */ (document.getElementById('minus'));
  const srStatusEl = /** @type {HTMLElement} */ (document.getElementById('sr-status'));

  if (!resultEl || !messageEl || !plusBtn || !minusBtn || !srStatusEl) {
    throw new Error('Не удалось найти элементы интерфейса. Проверьте разметку index.html.');
  }

  return { resultEl, messageEl, plusBtn, minusBtn, srStatusEl };
}

function main() {
  const dom = getDom();

  // Восстановление состояния (localStorage) + валидация/нормализация
  const restored = readJson(getStateStorageKey());
  const bootState = restored ? validateState(restored) : initialState;

  const store = createStore(bootState, reducer);

  // Handlers -> actions
  bindHandlers(dom, (action) => store.dispatch(action));

  // State -> UI
  store.subscribe((s) => render(s, dom));
  // State -> Persistence
  store.subscribe((s) => writeJson(getStateStorageKey(), s));
  render(store.getState(), dom);

  // Подсказка в title для крайних значений
  dom.plusBtn.title = `Максимум: ${MAX_COUNT}`;
  dom.minusBtn.title = `Минимум: ${MIN_COUNT}`;
}

document.addEventListener('DOMContentLoaded', main);
