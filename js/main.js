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
const weatherInfo = document.getElementById("weatherInfo");


// --------------------------------------
// 1. HANTERA INPUT + GET EXACT MATCHES
// --------------------------------------
cityInput.addEventListener("input", async () => {
    const text = cityInput.value.trim();

    // Om input är tom – rensa listan
    if (text.length === 0) {
        clearOptions();
        return;
    }

    // 1: Hämta ALLA träffar
    const allMatches = await cityApi(text);

    // 2: Filtrera exakta startswith-matcher (även åäö)
    const exactMatches = allMatches.filter(city =>
        city.name
            .toLocaleLowerCase("sv-SE")
            .startsWith(text.toLocaleLowerCase("sv-SE"))
    );

    if (exactMatches.length === 0) {
        clearOptions();
        return;
    }

    // 3: Sortera efter population – största först
    exactMatches.sort((a, b) => (b.population || 0) - (a.population || 0));

    // 4: Ta ut bästa matchen (den största)
    const bestMatch = exactMatches[0];

    // 5: Om det finns exakt 1 → välj direkt
    if (exactMatches.length === 1) {
        selectCity(bestMatch);
        return;
    }

    // 6: Flera lika → visa EN (största)
    renderOptions([bestMatch], selectCity);
});


// ------------------------------------------------
// 2. KEYBOARD NAVIGATION (PIL UPP/NED + ENTER)
// ------------------------------------------------
cityInput.addEventListener("keydown", (event) => {
    handleKeyboardNavigation(event, selectCity);
});


// ------------------------------------------------
// 3. selectCity() – KÄRNAN I APPEN
// ------------------------------------------------
async function selectCity(cityObj) {
    // Rensa alternativ-listan
    clearOptions();

    // Skriv stad i inputfältet
    cityInput.value = cityObj.name;

    // 1: Hämta väder från API
    const weather = await weatherApi(cityObj.latitude, cityObj.longitude);

    // Lägg till beskrivningen via translate-modulen
    weather.weather[0].description = translateWeatherCode(weather.weather[0].code);

    // Lägg till namn (väderApi vet inte stadens namn)
    weather.name = cityObj.name;

    // 2: Visa väderkort
    weatherInfo.innerHTML = "";
    const card = new WeatherCard(weather);
    weatherInfo.appendChild(card.render());

    // 3: Visa karta
    showMap(cityObj.latitude, cityObj.longitude);
}
