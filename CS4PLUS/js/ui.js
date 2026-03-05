import { OPERATIONS } from "./operations.js";

/**
 * Утилиты работы с UI.
 */

/**
 * @param {HTMLElement} root
 * @param {(operationId: string) => void} onOperation
 */
export function renderOperationButtons(root, onOperation) {
    root.innerHTML = "";

    for (const op of OPERATIONS) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn";
        btn.dataset.operationId = op.id;
        btn.textContent = op.label;
        btn.addEventListener("click", () => onOperation(op.id));
        root.appendChild(btn);
    }
}

/**
 * @param {HTMLInputElement} input
 * @param {HTMLElement} errorEl
 * @param {string} message
 */
export function showFieldError(input, errorEl, message) {
    input.classList.add("is-error");
    errorEl.textContent = message;
}

/**
 * @param {HTMLInputElement} input
 * @param {HTMLElement} errorEl
 */
export function clearFieldError(input, errorEl) {
    input.classList.remove("is-error");
    errorEl.textContent = "";
}

/**
 * @param {HTMLElement} resultEl
 * @param {string} text
 */
export function setResultOk(resultEl, text) {
    resultEl.classList.remove("is-error");
    resultEl.textContent = `Результат: ${text}`;
}

/**
 * @param {HTMLElement} resultEl
 * @param {string} message
 */
export function setResultError(resultEl, message) {
    resultEl.classList.add("is-error");
    resultEl.textContent = `Ошибка: ${message}`;
}

/**
 * @param {HTMLOListElement} list
 * @param {{expression: string, result: string, ts: number}[]} items
 */
export function renderHistory(list, items) {
    list.innerHTML = "";
    if (!items.length) {
        const li = document.createElement("li");
        li.textContent = "Пока пусто — сделайте вычисление.";
        list.appendChild(li);
        return;
    }

    for (const item of items) {
        const li = document.createElement("li");
        const time = new Date(item.ts).toLocaleString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
        });
        li.textContent = `[${time}] ${item.expression} = ${item.result}`;
        list.appendChild(li);
    }
}
