// main.js
// ======================================
// Binder ihop ALLA moduler
// ======================================

import { cityApi } from "./services/cityApi.js";
import { weatherApi } from "./services/weatherApi.js";
import { WeatherCard } from "./components/weathercard.js";
import { showMap } from "./components/mapView.js";
import {
    renderOptions,
    clearOptions,
    handleKeyboardNavigation
} from "./components/optionsList.js";

// DOM-element
const cityInput = document.getElementById("input");
const weatherInfo = document.getElementById("weatherInfo");


// ------------------------------------------------
// 1. HANTERA INPUT + VISA MATCHANDE STÄDER
// ------------------------------------------------
cityInput.addEventListener("input", async () => {
    const text = cityInput.value.trim();

    // Tom input → rensa
    if (text.length === 0) {
        clearOptions();
        return;
    }

    // Hämta träffar från backend
    const allMatches = await cityApi(text); 
    if (!allMatches || allMatches.length === 0) {
        clearOptions();
        return;
    }

    // Filtrera på exakt startswith (svenska tecken)
    const exactMatches = allMatches.filter(city =>
        city.name.toLocaleLowerCase("sv-SE")
            .startsWith(text.toLocaleLowerCase("sv-SE"))
    );

    if (exactMatches.length === 0) {
        clearOptions();
        return;
    }

    // Om exakt 1 → välj direkt
    if (exactMatches.length === 1) {
        selectCity(exactMatches[0]);
        return;
    }

    // Flera träffar → visa i dropdown
    renderOptions(exactMatches, selectCity);
});


// ------------------------------------------------
// 2. KEYBOARD NAVIGATION (PILAR + ENTER)
// ------------------------------------------------
cityInput.addEventListener("keydown", (event) => {
    handleKeyboardNavigation(event, selectCity);
});


// ------------------------------------------------
// 3. VÄLJ STAD → HÄMTA VÄDER + VISA KORT + KARTA
// ------------------------------------------------
async function selectCity(cityObj) {
    clearOptions();

    // Skriv vald stad i inputfältet
    cityInput.value = cityObj.name;

    const { lat, lon, name } = cityObj;

    // 1. Hämta väder från backend
    const weather = await weatherApi(lat, lon);
    if (!weather) {
        weatherInfo.textContent = "Kunde inte hämta väderdata.";
        return;
    }

    // Lägg till stadens namn i väderobjektet
    weather.name = name;

    // 2. Visa väderkort
    weatherInfo.innerHTML = "";
    const card = new WeatherCard(weather);
    weatherInfo.appendChild(card.render());

    // 3. Visa karta
    showMap(lat, lon);
}
