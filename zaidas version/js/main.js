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

    const bestMatch = exactMatches[0];

    // 4: Kolla om ALLA träffar ligger i samma land
    const allSameCountry = exactMatches.every(c => c.country === bestMatch.country);

    // 5: Om bara EN träff, välj direkt
    if (exactMatches.length === 1) {
        selectCity(bestMatch);
        return;
    }

    // 6: Om flera, men alla är i samma land → visa EN (största)
    if (allSameCountry) {
        renderOptions([bestMatch], selectCity);
        return;
    }

    // 7: Om flera och olika länder → visa ALLA
    renderOptions(exactMatches, selectCity);

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
    clearOptions();
    cityInput.value = cityObj.name;

    // Hämta väder
    const weather = await weatherApi(cityObj.latitude, cityObj.longitude);
    weather.weather[0].description = translateWeatherCode(weather.weather[0].code);
    weather.name = cityObj.name;

    // 1. Skapa ett nytt väderkort
    const card = new WeatherCard(weather).render();

    // 2. Lägg till kortet högst upp
    weatherInfo.prepend(card);

    // 3. Uppdatera kartan
    showMap(cityObj.latitude, cityObj.longitude);
}

