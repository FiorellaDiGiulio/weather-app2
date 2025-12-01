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
import { initDrawer } from "./drawer.js";


// --------------------------------------
// DOM-element (ALLT på ett ställe)
// --------------------------------------
const cityInput = document.getElementById("input");
const cityOptions = document.getElementById("cityOptions");

const layout = document.querySelector(".layout");
const weatherInfo = document.getElementById("weatherInfo");
const cityMap = document.getElementById("cityMap");

const savedContainer = document.getElementById("savedCards");


// --------------------------------------
// INITIERA DRAWER (ska ske efter DOM-queries)
// --------------------------------------
initDrawer();


// --------------------------------------
// 1. HANTERA INPUT + EXACT MATCHES
// --------------------------------------
cityInput.addEventListener("input", async () => {
    const text = cityInput.value.trim();

    if (text.length === 0) {
        clearOptions();
        return;
    }

    // Hämta alla träffar
    const allMatches = await cityApi(text);

    // Endast namn som börjar exakt med texten
    const exactMatches = allMatches.filter(city =>
        city.name.toLocaleLowerCase("sv-SE")
            .startsWith(text.toLocaleLowerCase("sv-SE"))
    );

    if (exactMatches.length === 0) {
        clearOptions();
        return;
    }

    // Sortera (största städer först)
    exactMatches.sort((a, b) => (b.population || 0) - (a.population || 0));

    // Se om alla är i samma land
    const bestMatch = exactMatches[0];
    const allSameCountry = exactMatches.every(c => c.country === bestMatch.country);

    // Om samma land, visa bara bästa träffen
    if (allSameCountry) {
        renderOptions([bestMatch], selectCity);
        return;
    }

    // Annars: visa flera val
    renderOptions(exactMatches, selectCity);
});


// --------------------------------------
// 2. KEYBOARD NAVIGATION
// --------------------------------------
cityInput.addEventListener("keydown", (event) => {
    handleKeyboardNavigation(event, selectCity);
});


// --------------------------------------
// 3. VÄLJ STAD (klick eller enter)
// --------------------------------------
async function selectCity(cityObj) {
    clearOptions();
    cityInput.value = cityObj.name;

    // 1. Hämta väder
    const weather = await weatherApi(cityObj.latitude, cityObj.longitude);

    // Lägg in översatt väderkod
    weather.weather[0].description = translateWeatherCode(weather.weather[0].code);
    weather.name = cityObj.name;

    // Lägg in koordinater direkt i objektet
    weather.lat = cityObj.latitude;
    weather.lon = cityObj.longitude;

    // 2. Skapa HUVUD-kortet + lägg in först
    const card = new WeatherCard(weather).render();
    WeatherCard.insert(card);

    // 3. Lägg till en klon i flärpens sparade kort
    const clone = card.cloneNode(true);
    savedContainer.appendChild(clone);

    // 4. Visa layout + kartsektion
    layout.classList.remove("hidden");
    weatherInfo.classList.remove("hidden");
    cityMap.classList.remove("hidden");

    // 5. Visa karta
    showMap(cityObj.latitude, cityObj.longitude);
}
