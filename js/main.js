import {cityApi} from "./services/cityApi.js";
import {weatherApi} from "./service/weatherApi.js";
import {WeatherCard, renderWeather} from "./components/weathercard.js"

const cityInput = document.getElementById("input");
const searchBtn = document.getElementById("inputBtn");

let currentCity  = "";

searchBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) return;

    const formattedCity = city[0].toUpperCase() + city.slice(1).toLowerCase();
    currentcity = formattedCity;

    const data = await weatherApi (formattedCity);
    renderWeather (data);
    
});

setInterval(async () => {
    if (currentCity) {
        const data = await weatherApi (currentCity);
        renderWeather(data);
        console.log("Automatisk uppdatering för: ", currentCity);
    }
}, 600000);
