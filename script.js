const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const toggleBtn = document.getElementById("toggleBtn");
const angleBtn = document.getElementById("angleBtn");
const scientific = document.querySelector(".scientific");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

let isScientific = false;
let isDegree = true;

// 🔹 Load history from localStorage
let historyData = JSON.parse(localStorage.getItem("calcHistory")) || [];

window.onload = () => {
    historyData.forEach(item => renderHistory(item));
};

// 🔹 Toggle Scientific
toggleBtn.onclick = () => {
    scientific.classList.toggle("hidden");
    isScientific = !isScientific;
    toggleBtn.textContent = isScientific ? "Basic Mode" : "Scientific Mode";
};

// 🔹 DEG / RAD
angleBtn.onclick = () => {
    isDegree = !isDegree;
    angleBtn.textContent = isDegree ? "DEG" : "RAD";
};

// 🔹 Button Clicks
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.textContent;

        if (btn.classList.contains("clear")) {
            display.value = "";
            return;
        }

        if (btn.classList.contains("equal")) {
            calculate();
            return;
        }

        if (btn.dataset.fn) {
            handleFunction(btn.dataset.fn);
            return;
        }

        display.value += value;
    });
});

// 🔹 Calculate
function calculate() {
    try {
        const expression = display.value;
        const result = eval(
            expression.replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-")
        );

        addHistory(`${expression} = ${result}`);
        display.value = result;
    } catch {
        display.value = "Error";
    }
}

// 🔹 Scientific functions
function handleFunction(fn) {
    let val = parseFloat(display.value);
    if (isDegree) val = val * (Math.PI / 180);

    let result;
    switch (fn) {
        case "sin":
            result = Math.sin(val);
            break;
        case "cos":
            result = Math.cos(val);
            break;
        case "tan":
            result = Math.tan(val);
            break;
        case "log":
            result = Math.log10(val);
            break;
        case "sqrt":
            result = Math.sqrt(val);
            break;
        case "pow":
            result = val * val;
            break;
        case "pi":
            result = Math.PI;
            break;
    }

    addHistory(`${fn}(${display.value}) = ${result}`);
    display.value = result;
}

// 🔹 History functions
function addHistory(text) {
    historyData.unshift(text);
    localStorage.setItem("calcHistory", JSON.stringify(historyData));
    renderHistory(text);
}

function renderHistory(text) {
    const li = document.createElement("li");
    li.textContent = text;
    historyList.prepend(li);
}

// 🔹 Clear History
clearHistoryBtn.onclick = () => {
    historyData = [];
    localStorage.removeItem("calcHistory");
    historyList.innerHTML = "";
};

// 🔹 Keyboard Support 🔥
document.addEventListener("keydown", (e) => {
    const key = e.key;

    if (!isNaN(key) || key === ".") {
        display.value += key;
    }

    if (["+", "-", "*", "/"].includes(key)) {
        const map = { "*": "×", "/": "÷", "-": "−", "+": "+" };
        display.value += map[key];
    }

    if (key === "Enter") {
        e.preventDefault();
        calculate();
    }

    if (key === "Backspace") {
        display.value = display.value.slice(0, -1);
    }

    if (key === "Escape") {
        display.value = "";
    }
});