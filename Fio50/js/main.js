import './components/theme.js';
import { cityApi } from "./services/cityApi.js";
import { SavedCitiesManager } from "./components/SavedCitiesManager.js";
import { renderOptions, clearOptions, handleKeyboardNavigation } from "./components/optionsList.js";

const cityInput = document.getElementById("input");
const cityOptions = document.getElementById("cityOptions");
const savedCitiesContainer = document.getElementById("savedCities");
const weatherInfo = document.getElementById("weatherInfo");
const weeklyContainer = document.getElementById("weeklyForecast");

const savedCitiesManager = new SavedCitiesManager(
    cityInput, savedCitiesContainer, weatherInfo, weeklyContainer
);

(async()=>{ await savedCitiesManager.renderSavedCities(false); })();

cityInput.addEventListener("input", async ()=>{
    const text = cityInput.value.trim();
    if(!text){ clearOptions(); await savedCitiesManager.renderSavedCities(); return; }
    const matches = await cityApi(text);
    clearOptions();
    renderOptions(matches, city=>savedCitiesManager.selectCity(city));
});

cityInput.addEventListener("keydown", e=>{
    handleKeyboardNavigation(e, city=>savedCitiesManager.selectCity(city));
});

document.getElementById("searchBtn").addEventListener("click", async ()=>{
    const query = cityInput.value.trim();
    if(!query) return;
    const matches = await cityApi(query);
    if(matches.length>0) savedCitiesManager.selectCity(matches[0]);
});
