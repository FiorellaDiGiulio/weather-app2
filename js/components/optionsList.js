/**
 * Modul som hanterar rendering och interaktion av stadsförslag.
 * Stöder både mus- och tangentbordsnavigation.
 */

let selectedIndex = -1;
let currentOptions = [];
let hoverIndex = -1;

/**
 * Rensar alla stadsalternativ och återställer internt tillstånd.
 */
export function clearOptions() {
    const container = document.getElementById("cityOptions");
    container.textContent = "";
    selectedIndex = -1;
    hoverIndex = -1;
    currentOptions = [];
}

/**
 * Renderar en lista med stadsförslag och kopplar händelser för mus och tangentbord.
 *
 * @param {Array<Object>} matches - Lista med matchande städer
 * @param {Function} onSelect - Callback som anropas när en stad väljs
 */
export function renderOptions(matches, onSelect) {
    const container = document.getElementById("cityOptions");
    clearOptions();

    container.addEventListener("mouseleave", () => {
        hoverIndex = -1;
        highlightOption();
    });

    matches.forEach((match, index) => {
        const btn = document.createElement("button");
        btn.textContent = `${match.name}, ${match.country}`;
        btn.className = "city-option";
        btn.setAttribute("tabindex", "-1");

        btn.addEventListener("mouseenter", () => {
            hoverIndex = index;
            highlightOption();
        });

        btn.addEventListener("click", () => onSelect(match));

        container.appendChild(btn);
        currentOptions.push(btn);
    });

    if (currentOptions.length > 0) {
        selectedIndex = 0;
        highlightOption();
    }
}

/**
 * Uppdaterar visuell markering av stadsalternativ.
 * Musmarkering prioriteras när musen är aktiv, annars används tangentbordsmarkering.
 */
export function highlightOption() {
    currentOptions.forEach((btn, idx) => {
        if (hoverIndex >= 0) {
            btn.classList.toggle("selected", idx === hoverIndex);
        } else {
            btn.classList.toggle("selected", idx === selectedIndex);
        }
    });
}

/**
 * Hanterar tangentbordsnavigation i listan med stadsalternativ.
 *
 * @param {KeyboardEvent} event - Tangentbordshändelsen
 * @param {Function} onSelect - Callback som anropas när ett alternativ väljs
 */
export function handleKeyboardNavigation(event, onSelect) {
    if (currentOptions.length === 0) return;

    if (event.key === "ArrowDown") {
        event.preventDefault();
        selectedIndex = (selectedIndex + 1) % currentOptions.length;
        hoverIndex = -1;
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
