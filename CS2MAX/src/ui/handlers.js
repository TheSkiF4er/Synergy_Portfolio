/**
 * Handlers слой: подписки на события UI.
 * Задача: перевести события в action и передать в dispatch.
 */

/**
 * @param {{
 *  plusBtn: HTMLButtonElement,
 *  minusBtn: HTMLButtonElement
 * }} dom
 * @param {(action: {type: 'INCREMENT'|'DECREMENT'|'RESET'}) => void} dispatch
 */
export function bindHandlers(dom, dispatch) {
  // Универсальный обработчик через data-action (DRY)
  const buttonsRoot = dom.plusBtn.parentElement;
  if (!buttonsRoot) throw new Error('Не удалось найти контейнер кнопок');
  buttonsRoot.addEventListener('click', (e) => {
    const target = /** @type {HTMLElement | null} */ (e.target instanceof HTMLElement ? e.target : null);
    const action = target?.closest('button')?.getAttribute('data-action');
    if (action === 'INCREMENT' || action === 'DECREMENT' || action === 'RESET') {
      dispatch({ type: action });
    }
  });

  // Клавиатурные шорткаты (UX)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === '+') dispatch({ type: 'INCREMENT' });
    if (e.key === 'ArrowDown' || e.key === '-') dispatch({ type: 'DECREMENT' });
    if (e.key === '0') dispatch({ type: 'RESET' });
  });
}
