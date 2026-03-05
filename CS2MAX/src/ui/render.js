import { deriveViewModel } from '../business/counter.js';

/** @typedef {import('../business/counter.js').CounterState} CounterState */

/**
 * Рендерит UI, основываясь на состоянии.
 * Централизованный render() — единственное место, которое меняет DOM.
 *
 * @param {CounterState} state
 * @param {{
 *  resultEl: HTMLElement,
 *  messageEl: HTMLElement,
 *  plusBtn: HTMLButtonElement,
 *  minusBtn: HTMLButtonElement,
 *  srStatusEl: HTMLElement
 * }} dom
 */
export function render(state, dom) {
  const vm = deriveViewModel(state);

  dom.resultEl.textContent = String(state.count);
  dom.messageEl.textContent = vm.message;

  // Контраст: класс определяет фон и цвет текста.
  dom.resultEl.classList.remove('result--neutral', 'result--positive', 'result--negative');
  dom.resultEl.classList.add(`result--${vm.resultTone}`);

  dom.plusBtn.disabled = vm.isPlusDisabled;
  dom.minusBtn.disabled = vm.isMinusDisabled;

  // SR-only статус (чтобы не перегружать role=status на большом числе быстрых кликов).
  dom.srStatusEl.textContent = `Значение: ${state.count}.`;

  // Небольшая анимация изменения числа
  triggerBump(dom.resultEl);
}

/**
 * Добавляет CSS-класс для анимации "bump".
 * Уважает prefers-reduced-motion.
 *
 * @param {HTMLElement} el
 */
function triggerBump(el) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.classList.remove('bump');
  // Перезапуск анимации
  // eslint-disable-next-line no-unused-expressions
  el.offsetWidth;
  el.classList.add('bump');
}
