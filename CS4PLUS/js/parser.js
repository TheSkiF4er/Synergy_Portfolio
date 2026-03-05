/**
 * Парсинг чисел из текстовых полей.
 *
 * Поддержка:
 * - пробелы внутри ввода ("1 000" → 1000)
 * - запятая как десятичный разделитель ("12,5" → 12.5)
 */

/**
 * @param {string} raw
 * @returns {{ ok: true, value: number } | { ok: false, message: string }}
 */
export function parseNumber(raw) {
    const normalized = String(raw)
        .trim()
        .replace(/\s+/g, "")
        .replace(/,/g, ".");

    if (normalized.length === 0) {
        return { ok: false, message: "Поле не должно быть пустым" };
    }

    // Разрешаем ведущий +/-, десятичную точку, экспоненту.
    // Number("1e3") → 1000
    const value = Number(normalized);

    if (!Number.isFinite(value)) {
        return { ok: false, message: "Введите корректное число" };
    }

    return { ok: true, value };
}
