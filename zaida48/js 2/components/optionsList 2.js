// optionsList.js
// ======================================
// Hanterar dropdown med städer
// Fokus stannar i input tills pil/tab
// Highlight flyttas med mus eller tangentbord
// ======================================

let selectedIndex = -1;
let currentOptions = [];

// ------------------------------
// 1. Rensa listan
// ------------------------------
export function clearOptions() {
    const container = document.getElementById("cityOptions");
    container.innerHTML = "";
    container.classList.add("hidden");
    selectedIndex = -1;
    currentOptions = [];
}

// ------------------------------
// 2. Rendera alternativ
// ------------------------------
export function renderOptions(matches, onSelect) {
    const container = document.getElementById("cityOptions");
    clearOptions();

    // Visa INTE listan om bara 1 match
    if (matches.length <= 1) return;

    container.classList.remove("hidden");

    matches.forEach((match, index) => {
        const btn = document.createElement("button");
        btn.textContent = `${match.name}, ${match.country}`;
        btn.className = "city-option";

        // Kan tabbas inom listan, men inte innan man gått in dit
        btn.setAttribute("tabindex", "-1");
        btn.setAttribute("role", "option");

        // MUS: välj stad
        btn.addEventListener("click", () => onSelect(match));

        // MUS: highlight (flyttar inte fokus)
        btn.addEventListener("mouseenter", () => {
            selectedIndex = index;
            updateHighlight(false);
        });

        currentOptions.push(btn);
        container.appendChild(btn);
    });

    // Visuell highlight på första item (utan fokusflytt)
    selectedIndex = 0;
    updateHighlight(false);
}

// ------------------------------
// 3. Uppdatera highlight
// ------------------------------
function updateHighlight(shouldFocus) {
    currentOptions.forEach((btn, index) => {
        const active = index === selectedIndex;

        btn.classList.toggle("selected", active);

        // Flytta fokus ENDAST om vi vet att användaren
        // navigerar med tangentbord (pil/tab)
        if (active && shouldFocus) {
            btn.focus();
        }
    });
}

// ------------------------------
// 4. Tangentbordsnavigation
// ------------------------------
export function handleKeyboardNavigation(event, onSelect) {
    if (currentOptions.length === 0) return;

    const activeId = document.activeElement.id;

    switch (event.key) {

        case "ArrowDown":
            event.preventDefault();

            // Första pilnedtrycket: gå från input -> första i listan
            if (activeId === "input") {
                selectedIndex = 0;
                updateHighlight(true);
                return;
            }

            // Navigera i listan
            selectedIndex = (selectedIndex + 1) % currentOptions.length;
            updateHighlight(true);
            break;

        case "ArrowUp":
            // Upp-pil gör inget om vi fortfarande är i input
            if (activeId === "input") return;

            event.preventDefault();
            selectedIndex =
                (selectedIndex - 1 + currentOptions.length) % currentOptions.length;
            updateHighlight(true);
            break;

        case "Tab":
            // TAB från input: hoppa in i listan på första alternativet
            if (activeId === "input") {
                event.preventDefault();
                selectedIndex = 0;
                updateHighlight(true);
            }
            // TAB när vi redan är i listan: låt browsern sköta det
            break;

        case "Enter":
            // VIKTIGT:
            // - Om fokus är i input → låt main.js ta Enter (direktval)
            // - Om fokus är i listan → välj markerat alternativ
            if (activeId === "input") {
                return; // main.js har en egen Enter-lyssnare
            }

            event.preventDefault();
            if (currentOptions[selectedIndex]) {
                currentOptions[selectedIndex].click();
            }
            break;
    }
}
