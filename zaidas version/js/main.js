// main.js
// ======================================
// Binder ihop ALLA moduler
// ======================================

import { cityApi } from "./services/cityApi.js";
import { weatherApi } from "./services/weatherApi.js";
import { translateWeatherCode } from "./utility/translate.js";
import { WeatherCard } from "./components/weathercard.js";
import { showMap } from "./components/mapView.js";

import {
    renderOptions,
    clearOptions,
    handleKeyboardNavigation
} from "./components/optionsList.js";

// DOM-element
const cityInput = document.getElementById("input");
const cityOptions = document.getElementById("cityOptions");


// --------------------------------------
// 1. HANTERA INPUT + EXACT MATCHES
// --------------------------------------
cityInput.addEventListener("input", async () => {
    const text = cityInput.value.trim();

    if (text.length === 0) {
        clearOptions();
        return;
    }

    const allMatches = await cityApi(text);

    const exactMatches = allMatches.filter(city =>
        city.name
            .toLocaleLowerCase("sv-SE")
            .startsWith(text.toLocaleLowerCase("sv-SE"))
    );

    if (exactMatches.length === 0) {
        clearOptions();
        return;
    }

    exactMatches.sort((a, b) => (b.population || 0) - (a.population || 0));

    const bestMatch = exactMatches[0];
    const allSameCountry = exactMatches.every(c => c.country === bestMatch.country);

    if (exactMatches.length === 1) {
        selectCity(bestMatch);
        return;
    }

    if (allSameCountry) {
        renderOptions([bestMatch], selectCity);
        return;
    }

    renderOptions(exactMatches, selectCity);
});


// --------------------------------------
// 2. KEYBOARD NAVIGATION
// --------------------------------------
cityInput.addEventListener("keydown", (event) => {
    handleKeyboardNavigation(event, selectCity);
});


// --------------------------------------
// 3. selectCity() – minimal, ren logik
// --------------------------------------
async function selectCity(cityObj) {
    clearOptions();
    cityInput.value = cityObj.name;

    // 1: Hämta väder
    const weather = await weatherApi(cityObj.latitude, cityObj.longitude);

    weather.weather[0].description = translateWeatherCode(weather.weather[0].code);
    weather.name = cityObj.name;

    // Koordinater läggs in för WeatherCard-modulen
    weather.lat = cityObj.latitude;
    weather.lon = cityObj.longitude;

    // 2: Skapa kort
    const card = new WeatherCard(weather).render();

    // WEATHER CARD hanterar ALLT:
    // - Ta bort dubletter
    // - Prepend
    WeatherCard.insert(card);

    // 3: Visa karta
    showMap(cityObj.latitude, cityObj.longitude);
}
