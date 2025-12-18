/**
 * Initierar och applicerar valt tema direkt vid sidladdning.
 */
import './components/theme.js';

import { cityApi } from "./services/cityApi.js";
import { SavedCitiesManager } from "./components/SavedCitiesManager.js";
import { renderOptions, clearOptions, handleKeyboardNavigation } from "./components/optionsList.js";

/**
 * Inputfält där användaren skriver stadens namn.
 * @type {HTMLInputElement}
 */
const cityInput = document.getElementById("input");

/**
 * Container för listan med stadförslag.
 * @type {HTMLElement}
 */
const cityOptions = document.getElementById("cityOptions");

/**
 * Container där sparade städer visas.
 * @type {HTMLElement}
 */
const savedCitiesContainer = document.getElementById("savedCities");

/**
 * Container för aktuell väderinformation.
 * @type {HTMLElement}
 */
const weatherInfo = document.getElementById("weatherInfo");

/**
 * Container för veckoprognosen.
 * @type {HTMLElement}
 */
const weeklyContainer = document.getElementById("weeklyForecast");

/**
 * Hanterar logik för sparade städer, rendering och val av stad.
 * @type {SavedCitiesManager}
 */
const savedCitiesManager = new SavedCitiesManager(
    cityInput,
    savedCitiesContainer,
    weatherInfo,
    weeklyContainer
);

/**
 * Renderar sparade städer vid start.
 * Körs som en IIFE för att möjliggöra async/await.
 */
(async () => {
    await savedCitiesManager.renderSavedCities(false);
})();

/**
 * Lyssnar på input i sökfältet och hämtar matchande städer.
 * Rensar alternativ och återställer sparade städer om input är tomt.
 */
cityInput.addEventListener("input", async () => {
    const text = cityInput.value.trim();

    if (!text) {
        clearOptions();
        await savedCitiesManager.renderSavedCities();
        return;
    }

    const matches = await cityApi(text);

    clearOptions();
    renderOptions(matches, city => savedCitiesManager.selectCity(city));
});

/**
 * Hanterar tangentbordsnavigering (Enter och piltangenter)
 * i listan med stadförslag.
 */
cityInput.addEventListener("keydown", e => {
    handleKeyboardNavigation(e, city => savedCitiesManager.selectCity(city));
});

/**
 * Utför stadssökning när användaren klickar på sökknappen.
 * Väljer första matchande stad om någon hittas.
 */
document.getElementById("searchBtn").addEventListener("click", async () => {
    const query = cityInput.value.trim();
    if (!query) return;

    const matches = await cityApi(query);
    if (matches.length > 0) {
        savedCitiesManager.selectCity(matches[0]);
    }
});
