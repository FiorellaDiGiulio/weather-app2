// optionsList.js
// ==============================================
// Hanterar renderingen av stad-alternativ + navigation
// ==============================================

let selectedIndex = -1; // aktiv rad
let currentOptions = []; // sparar knapparna

export function clearOptions() {
    const container = document.getElementById("cityOptions");
    container.innerHTML = "";
    selectedIndex = -1;
    currentOptions = [];
}

export function renderOptions(matches, onSelect) {
    const container = document.getElementById("cityOptions");
    clearOptions();

    matches.forEach(match => {
        const btn = document.createElement("button");
        btn.textContent = `${match.name}, ${match.country}`;
        btn.className = "city-option";
        btn.setAttribute("tabindex", "0");
        btn.setAttribute("role", "option");

        btn.addEventListener("click", () => onSelect(match));

        container.appendChild(btn);
        currentOptions.push(btn);
    });
}

export function highlightOption() {
    currentOptions.forEach((btn, idx) => {
        if (idx === selectedIndex) {
            btn.classList.add("selected");
            btn.focus();
        } else {
            btn.classList.remove("selected");
        }
    });
}

// Tangentbordsstyrning
export function handleKeyboardNavigation(event, onSelect) {
    if (currentOptions.length === 0) return;

    if (event.key === "ArrowDown") {
        event.preventDefault();
        selectedIndex = (selectedIndex + 1) % currentOptions.length;
        highlightOption();
    }

    if (event.key === "ArrowUp") {
        event.preventDefault();
        selectedIndex = (selectedIndex - 1 + currentOptions.length) % currentOptions.length;
        highlightOption();
    }

    if (event.key === "Enter" && selectedIndex >= 0) {
        event.preventDefault();
        currentOptions[selectedIndex].click();
    }
}
