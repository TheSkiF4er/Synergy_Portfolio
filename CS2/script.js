document.addEventListener("DOMContentLoaded", function () {
    const resultElement = document.getElementById("result");
    const plusButton = document.getElementById("plus");
    const minusButton = document.getElementById("minus");
    const messageElement = document.getElementById("message");

    let count = 0;

    function updateUI() {
        resultElement.textContent = count;

        // Background color logic
        if (count > 0) {
            resultElement.style.backgroundColor = "yellow";
        } else if (count < 0) {
            resultElement.style.backgroundColor = "green";
        } else {
            resultElement.style.backgroundColor = "red";
        }

        // Disable buttons at limits
        plusButton.disabled = count === 10;
        minusButton.disabled = count === -10;

        // Extreme value message
        if (count === 10 || count === -10) {
            messageElement.textContent = "Вы достигли экстремального значения";
        } else {
            messageElement.textContent = "";
        }
    }

    plusButton.addEventListener("click", function () {
        if (count < 10) {
            count++;
            updateUI();
        }
    });

    minusButton.addEventListener("click", function () {
        if (count > -10) {
            count--;
            updateUI();
        }
    });

    updateUI();
});
