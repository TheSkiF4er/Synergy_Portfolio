const num1Input = document.getElementById("num1");
const num2Input = document.getElementById("num2");
const resultDiv = document.getElementById("result");

function getNumbers() {
    const num1 = parseFloat(num1Input.value);
    const num2 = parseFloat(num2Input.value);
    if (isNaN(num1) || isNaN(num2)) {
        resultDiv.textContent = "Ошибка: введите корректные числа!";
        return null;
    }
    return [num1, num2];
}

document.getElementById("sum").addEventListener("click", () => {
    const numbers = getNumbers();
    if (numbers) resultDiv.textContent = "Результат: " + (numbers[0] + numbers[1]);
});

document.getElementById("subtract").addEventListener("click", () => {
    const numbers = getNumbers();
    if (numbers) resultDiv.textContent = "Результат: " + (numbers[0] - numbers[1]);
});

document.getElementById("multiply").addEventListener("click", () => {
    const numbers = getNumbers();
    if (numbers) resultDiv.textContent = "Результат: " + (numbers[0] * numbers[1]);
});

document.getElementById("divide").addEventListener("click", () => {
    const numbers = getNumbers();
    if (numbers) {
        if (numbers[1] === 0) {
            resultDiv.textContent = "Ошибка: деление на ноль!";
        } else {
            resultDiv.textContent = "Результат: " + (numbers[0] / numbers[1]);
        }
    }
});
