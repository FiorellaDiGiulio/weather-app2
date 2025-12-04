import './components/theme.js'; // Lägg först så temat sätts direkt
import { cityApi } from "./services/cityApi.js";
import { SavedCitiesManager } from "./components/SavedCitiesManager.js";
import { renderOptions, clearOptions, handleKeyboardNavigation } from "./components/optionsList.js";

const cityInput = document.getElementById("input");
const cityOptions = document.getElementById("cityOptions");
const savedCitiesContainer = document.getElementById("savedCities");
const weatherInfo = document.getElementById("weatherInfo");
const weeklyContainer = document.getElementById("weeklyForecast"); // Veckovädercontainer

// Skapa instans av SavedCitiesManager
const savedCitiesManager = new SavedCitiesManager(
    cityInput,
    savedCitiesContainer,
    weatherInfo,
    weeklyContainer // skickar med veckovädercontainer
);

// Rendera sparade städer direkt vid start (döljer dem)
(async () => {
    await savedCitiesManager.renderSavedCities(false);
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

// Event: Enter / pilar
cityInput.addEventListener("keydown", e => {
    handleKeyboardNavigation(e, city => savedCitiesManager.selectCity(city));
});

// Event: Klick på sök-knappen
document.getElementById("searchBtn").addEventListener("click", async () => {
    const query = cityInput.value.trim();
    if (!query) return;

    const matches = await cityApi(query);
    if (matches.length > 0) {
        savedCitiesManager.selectCity(matches[0]);
    }
});