import { cityApi } from "./services/cityApi.js";
import { SavedCitiesManager } from "./components/savedCitiesManager.js";
import { renderOptions, clearOptions, handleKeyboardNavigation } from "./components/optionsList.js";

const cityInput = document.getElementById("input");
const cityOptions = document.getElementById("cityOptions");
const savedCitiesContainer = document.getElementById("savedCities");
const weatherInfo = document.getElementById("weatherInfo");

// Skapa instans av SavedCitiesManager
const savedCitiesManager = new SavedCitiesManager(cityInput, savedCitiesContainer, weatherInfo);

// Rendera sparade städer direkt vid start
(async () => {
    await savedCitiesManager.renderSavedCities();
})();

// Event: Sök-stad när användaren skriver
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

// Event: Enter / pilstyrning
cityInput.addEventListener("keydown", e =>
    handleKeyboardNavigation(e, city => savedCitiesManager.selectCity(city))
);

// Event: Klick på sök-knappen
document.getElementById("searchBtn").addEventListener("click", async () => {
    if (cityInput.value.trim().length === 0) return;

    const matches = await cityApi(cityInput.value.trim());
    if (matches.length > 0) savedCitiesManager.selectCity(matches[0]);
});
