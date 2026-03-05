/**
 * Расширенный набор математических операций.
 *
 * Чтобы добавить новую операцию:
 * 1) Добавьте объект в OPERATIONS
 * 2) Реализуйте handler (чистая функция)
 * 3) (Опционально) добавьте тест в tests/runTests.js
 */

/**
 * @typedef {Object} Operation
 * @property {string} id - уникальный идентификатор
 * @property {string} label - текст на кнопке
 * @property {"binary"|"unary"} arity - число аргументов
 * @property {(a: number, b?: number) => number} handler
 * @property {(a: number, b?: number) => string} format - формат выражения для истории
 */

function ensureFinite(value) {
    if (!Number.isFinite(value)) {
        throw new Error("Результат не является конечным числом");
    }
    return value;
}

/** @type {Operation[]} */
export const OPERATIONS = [
    {
        id: "sum",
        label: "Сумма (A + B)",
        arity: "binary",
        handler: (a, b) => ensureFinite(a + (b ?? 0)),
        format: (a, b) => `${a} + ${b}`,
    },
    {
        id: "subtract",
        label: "Разность (A − B)",
        arity: "binary",
        handler: (a, b) => ensureFinite(a - (b ?? 0)),
        format: (a, b) => `${a} − ${b}`,
    },
    {
        id: "multiply",
        label: "Произведение (A × B)",
        arity: "binary",
        handler: (a, b) => ensureFinite(a * (b ?? 0)),
        format: (a, b) => `${a} × ${b}`,
    },
    {
        id: "divide",
        label: "Деление (A ÷ B)",
        arity: "binary",
        handler: (a, b) => {
            if (b === 0) throw new Error("Деление на ноль");
            return ensureFinite(a / (b ?? 1));
        },
        format: (a, b) => `${a} ÷ ${b}`,
    },
    {
        id: "power",
        label: "Степень (A ^ B)",
        arity: "binary",
        handler: (a, b) => ensureFinite(Math.pow(a, b ?? 1)),
        format: (a, b) => `${a} ^ ${b}`,
    },
    {
        id: "mod",
        label: "Остаток (A mod B)",
        arity: "binary",
        handler: (a, b) => {
            if (b === 0) throw new Error("Остаток от деления на ноль");
            return ensureFinite(a % (b ?? 1));
        },
        format: (a, b) => `${a} mod ${b}`,
    },
    {
        id: "sqrt",
        label: "Корень (√A)",
        arity: "unary",
        handler: (a) => {
            if (a < 0) throw new Error("Нельзя извлечь корень из отрицательного числа");
            return ensureFinite(Math.sqrt(a));
        },
        format: (a) => `√(${a})`,
    },
    {
        id: "log",
        label: "Логарифм (ln A)",
        arity: "unary",
        handler: (a) => {
            if (a <= 0) throw new Error("Логарифм определён только для A > 0");
            return ensureFinite(Math.log(a));
        },
        format: (a) => `ln(${a})`,
    },
    {
        id: "sin",
        label: "Синус (sin A)",
        arity: "unary",
        handler: (a) => ensureFinite(Math.sin(a)),
        format: (a) => `sin(${a})`,
    },
    {
        id: "cos",
        label: "Косинус (cos A)",
        arity: "unary",
        handler: (a) => ensureFinite(Math.cos(a)),
        format: (a) => `cos(${a})`,
    },
];

/**
 * Удобный поиск операции по id.
 * @param {string} id
 * @returns {Operation | undefined}
 */
export function getOperation(id) {
    return OPERATIONS.find((op) => op.id === id);
}
