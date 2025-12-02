// main.js
// ======================================
// Binder ihop ALLA moduler
// ======================================

import { cityApi } from "./services/cityApi.js";
import { weatherApi } from "./services/weatherApi.js";
import { translateWeatherCode } from "./utility/translate.js";
import { WeatherCard } from "./components/weathercard.js";
import { showMap } from "./components/mapView.js";
import { renderOptions, clearOptions, handleKeyboardNavigation } from "./components/optionsList.js";
import { initDrawer } from "./components/drawer.js";


// --------------------------------------
// DOM-element
// --------------------------------------
const cityInput = document.getElementById("input");
const cityOptions = document.getElementById("cityOptions");
const layout = document.querySelector(".layout");
const weatherInfo = document.getElementById("weatherInfo");
const cityMap = document.getElementById("cityMap");
const savedContainer = document.getElementById("savedCards");


// --------------------------------------
// Initiera drawer (om modulen finns i HTML)
// --------------------------------------
initDrawer();


// -------------------------------------------------
// 1. INPUT TYPING → Hämta träffar & visa alternativ
// -------------------------------------------------
cityInput.addEventListener("input", async () => {
    const text = cityInput.value.trim();

    if (text.length === 0) {
        clearOptions();
        return;
    }

    const allMatches = await cityApi(text);

    // FILTRERA exact start-match (t.ex. "Gö" → visar "Göteborg")
    const exactStarts = allMatches.filter(city =>
        city.name.toLowerCase().startsWith(text.toLowerCase())
    );

    // Sortera störst → minst befolkning
    exactStarts.sort((a, b) => (b.population || 0) - (a.population || 0));

    // Visa dropdown ENDAST om fler än 1 alternativ
    if (exactStarts.length > 1) {
        renderOptions(exactStarts, selectCity);
    } else {
        clearOptions();
    }
});


// -------------------------------------------------
// 2. Piltangenter i input
// -------------------------------------------------
cityInput.addEventListener("keydown", (event) => {
    handleKeyboardNavigation(event, selectCity);
});


// -------------------------------------------------
// 3. ENTER i input → välj direkt om det är möjligt
// -------------------------------------------------
cityInput.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const text = cityInput.value.trim();
    if (!text) return;

    const allMatches = await cityApi(text);

    // EXAKT match
    const exactMatch = allMatches.find(
        (c) => c.name.toLowerCase() === text.toLowerCase()
    );

    if (exactMatch) {
        selectCity(exactMatch);
        return;
    }

    // OM BARA 1 TRÄFF → välj automatiskt
    if (allMatches.length === 1) {
        selectCity(allMatches[0]);
        return;
    }

    // annars: gör ingenting → användaren måste välja ur listan
});


// -------------------------------------------------
// 4. När användaren väljer en stad
// -------------------------------------------------
async function selectCity(cityObj) {
    clearOptions();
    cityInput.value = cityObj.name;

    // 1. Hämta väderdata
    const weather = await weatherApi(cityObj.latitude, cityObj.longitude);

    // Översätt väderkod
    weather.weather[0].description = translateWeatherCode(weather.weather[0].code);

    // Lägg in nödvändiga properties
    weather.name = cityObj.name;
    weather.lat = cityObj.latitude;
    weather.lon = cityObj.longitude;

    // 2. Skapa väderkort
    const card = new WeatherCard(weather).render();
    WeatherCard.insert(card);

    // 3. Lägg kortet i "sparade städer"
    const clone = card.cloneNode(true);
    savedContainer.appendChild(clone);

    // 4. Visa layout och sektioner
    layout.classList.remove("hidden");
    weatherInfo.classList.remove("hidden");
    cityMap.classList.remove("hidden");

    // 5. Visa karta
    showMap(cityObj.latitude, cityObj.longitude);
}
