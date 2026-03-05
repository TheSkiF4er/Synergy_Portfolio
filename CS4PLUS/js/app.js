import { getOperation } from "./operations.js";
import { parseNumber } from "./parser.js";
import { addHistoryItem, clearHistory as clearHistoryStorage, loadHistory } from "./history.js";
import {
    clearFieldError,
    renderHistory,
    renderOperationButtons,
    setResultError,
    setResultOk,
    showFieldError,
} from "./ui.js";

/**
 * Точка входа приложения.
 * Архитектура построена модульно (ES Modules), чтобы легко добавлять функции.
 */

// DOM
const num1Input = /** @type {HTMLInputElement} */ (document.getElementById("num1"));
const num2Input = /** @type {HTMLInputElement} */ (document.getElementById("num2"));
const num1Error = /** @type {HTMLElement} */ (document.getElementById("num1Error"));
const num2Error = /** @type {HTMLElement} */ (document.getElementById("num2Error"));
const resultEl = /** @type {HTMLElement} */ (document.getElementById("result"));
const buttonsRoot = /** @type {HTMLElement} */ (document.querySelector(".buttons"));
const historyList = /** @type {HTMLOListElement} */ (document.getElementById("historyList"));
const clearFieldsBtn = /** @type {HTMLButtonElement} */ (document.getElementById("clearFields"));
const clearHistoryBtn = /** @type {HTMLButtonElement} */ (document.getElementById("clearHistory"));

/** @type {ReturnType<typeof loadHistory>} */
let history = loadHistory();
renderHistory(historyList, history);

// UX: очищаем подсветку ошибки при вводе
num1Input.addEventListener("input", () => clearFieldError(num1Input, num1Error));
num2Input.addEventListener("input", () => clearFieldError(num2Input, num2Error));

clearFieldsBtn.addEventListener("click", () => {
    num1Input.value = "";
    num2Input.value = "";
    clearFieldError(num1Input, num1Error);
    clearFieldError(num2Input, num2Error);
    setResultOk(resultEl, "—");
    num1Input.focus();
});

clearHistoryBtn.addEventListener("click", () => {
    clearHistoryStorage();
    history = [];
    renderHistory(historyList, history);
});

renderOperationButtons(buttonsRoot, (operationId) => {
    const op = getOperation(operationId);
    if (!op) return;

    // Сбрасываем прошлые ошибки
    clearFieldError(num1Input, num1Error);
    clearFieldError(num2Input, num2Error);

    // Парсим A
    const aParsed = parseNumber(num1Input.value);
    if (!aParsed.ok) {
        showFieldError(num1Input, num1Error, aParsed.message);
        setResultError(resultEl, "Проверьте поле A");
        return;
    }

    // Парсим B только если операция бинарная
    let bValue = undefined;
    if (op.arity === "binary") {
        const bParsed = parseNumber(num2Input.value);
        if (!bParsed.ok) {
            showFieldError(num2Input, num2Error, bParsed.message);
            setResultError(resultEl, "Проверьте поле B");
            return;
        }
        bValue = bParsed.value;
    }

    try {
        const result = op.handler(aParsed.value, bValue);
        const resultStr = formatNumber(result);

        setResultOk(resultEl, resultStr);
        const expression = op.format(aParsed.value, bValue);

        history = addHistoryItem(history, {
            expression,
            result: resultStr,
        });
        renderHistory(historyList, history);
    } catch (e) {
        const message = e instanceof Error ? e.message : "Неизвестная ошибка";
        setResultError(resultEl, message);
    }
});

/**
 * Форматирование результата: без лишних длинных хвостов, но с сохранением точности.
 * @param {number} value
 */
function formatNumber(value) {
    // Для больших/малых чисел используем экспоненту.
    if (Math.abs(value) >= 1e10 || (Math.abs(value) > 0 && Math.abs(value) < 1e-6)) {
        return value.toExponential(8).replace(/0+e/, "e");
    }

    // Обычный вывод, обрезаем до 10 знаков после запятой, убираем хвостовые нули.
    const fixed = value.toFixed(10);
    return fixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
