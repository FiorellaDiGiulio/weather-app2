// optionsList.js
// ===============================
// Hanterar listan med stadsförslag
// ===============================

let selectedIndex = -1;
let currentOptions = [];
let hoverIndex = -1;          // temporär musmarkering
let mouseleaveAttached = false; // så vi inte lägger till fler lyssnare än en

export function clearOptions() {
    const container = document.getElementById("cityOptions");
    if (!container) return;

    container.innerHTML = "";
    selectedIndex = -1;
    hoverIndex = -1;
    currentOptions = [];
}

export function renderOptions(matches, onSelect) {
    const container = document.getElementById("cityOptions");
    if (!container) return;

    // Töm listan + nollställ index
    clearOptions();

    // Lägg bara till mouseleave EN gång
    if (!mouseleaveAttached) {
        container.addEventListener("mouseleave", () => {
            hoverIndex = -1;      // släpp musmarkeringen
            highlightOption();    // visa tangentbordsmarkeringen igen (om någon)
        });
        mouseleaveAttached = true;
    }

    // Skapa en knapp per träff
    matches.forEach((match, index) => {
        const btn = document.createElement("button");
        btn.textContent = `${match.name}, ${match.country}`;
        btn.className = "city-option";
        btn.setAttribute("tabindex", "-1");

        // MUSMARKERING (temporär highlight)
        btn.addEventListener("mouseenter", () => {
            hoverIndex = index;
            highlightOption();
        });

        // MUSKLICK = välj stad
        btn.addEventListener("click", () => onSelect(match));

        currentOptions.push(btn);
        container.appendChild(btn);
    });

    // Förvald markering med tangentbord
    if (currentOptions.length > 0) {
        selectedIndex = 0;
        highlightOption();
    }
}

export function highlightOption() {
    if (!currentOptions || currentOptions.length === 0) return;

    currentOptions.forEach((btn, idx) => {
        // Visuell markering: hover prioriteras när musen är över listan
        if (hoverIndex >= 0) {
            btn.classList.toggle("selected", idx === hoverIndex);
        } else {
            btn.classList.toggle("selected", idx === selectedIndex);
        }
    });
}

export function handleKeyboardNavigation(event, onSelect) {
    if (!currentOptions || currentOptions.length === 0) return;

    if (event.key === "ArrowDown") {
        event.preventDefault();
        selectedIndex = (selectedIndex + 1) % currentOptions.length;
        hoverIndex = -1; // tangentbord tar över
        highlightOption();
    }
    else if (event.key === "ArrowUp") {
        event.preventDefault();
        selectedIndex = (selectedIndex - 1 + currentOptions.length) % currentOptions.length;
        hoverIndex = -1;
        highlightOption();
    }
    else if (event.key === "Enter" && selectedIndex >= 0) {
        event.preventDefault();
        // trigga samma som klick
        currentOptions[selectedIndex].click();
    }
}
