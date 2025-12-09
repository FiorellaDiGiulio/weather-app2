let selectedIndex = -1;
let currentOptions = [];
let hoverIndex = -1; // Temporär musmarkering

export function clearOptions() {
    const container = document.getElementById("cityOptions");
    container.textContent = "";
    selectedIndex = -1;
    hoverIndex = -1;
    currentOptions = [];
}

export function renderOptions(matches, onSelect) {
    const container = document.getElementById("cityOptions");
    clearOptions();

    // Mus lämnar listan → ta bort hover
    container.addEventListener("mouseleave", () => {
        hoverIndex = -1;
        highlightOption(); // Visa tangentbordsmarkeringen igen
    });

    matches.forEach((match, index) => {
        const btn = document.createElement("button");
        btn.textContent = `${match.name}, ${match.country}`;
        btn.className = "city-option";
        btn.setAttribute("tabindex", "-1");

        // MUSMARKERING (temporär)
        btn.addEventListener("mouseenter", () => {
            hoverIndex = index;
            highlightOption();
        });

        // MUSKLICK
        btn.addEventListener("click", () => onSelect(match));

        container.appendChild(btn);
        currentOptions.push(btn);
    });

    // Tangentbordsförvald markering
    if (currentOptions.length > 0) {
        selectedIndex = 0;
        highlightOption();
    }
}

export function highlightOption() {
    currentOptions.forEach((btn, idx) => {
        // Visuell markering: hover prioriteras endast när musen är över
        if (hoverIndex >= 0) {
            btn.classList.toggle("selected", idx === hoverIndex);
        } else {
            btn.classList.toggle("selected", idx === selectedIndex);
        }
    });
}

export function handleKeyboardNavigation(event, onSelect) {
    if (currentOptions.length === 0) return;

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
        currentOptions[selectedIndex].click();
    }
}