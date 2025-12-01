import { weatherApi } from "../services/weatherApi.js";
import { translateWeatherCode } from "../utility/translate.js";
import { WeatherCard } from "./weathercard.js";
import { showMap } from "./mapView.js";
import { clearOptions } from "./optionsList.js";

export class SavedCitiesManager {
    constructor(cityInput, savedCitiesContainer, weatherInfo) {
        this.cityInput = cityInput;
        this.savedCitiesContainer = savedCitiesContainer;
        this.weatherInfo = weatherInfo;

        this.savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
    }

    saveCities() {
        localStorage.setItem("savedCities", JSON.stringify(this.savedCities));
    }

    // Renderar sparade städer som kort med temperatur
    async renderSavedCities(show = true) {
        this.savedCitiesContainer.innerHTML = "";

        if (!show) return;
        if (this.savedCities.length === 0) return;

        for (const city of this.savedCities) {
            const weather = await weatherApi(city.latitude, city.longitude);

            let weatherText = "";
            let tempText = 0;

            if (weather) {
                if (weather.weather && weather.weather[0]) {
                    weatherText = translateWeatherCode(weather.weather[0].code);
                }

                if (weather.main?.temp !== undefined) {
                    tempText = Math.round(weather.main.temp);
                } else if (weather.weather && weather.weather[0]) {
                    tempText = Math.round(weather.weather[0].temperature ?? weather.weather[0].temp ?? 0);
                }
            }

            // Skapa kort
            const card = document.createElement("div");
            card.className = "city-card";
            card.tabIndex = 0;

            const info = document.createElement("div");
            info.className = "city-info";

            const nameEl = document.createElement("div");
            nameEl.className = "city-name";
            nameEl.textContent = `${city.name}, ${city.country}`;

            const weatherEl = document.createElement("div");
            weatherEl.className = "city-weather";
            weatherEl.textContent = weatherText;

            info.appendChild(nameEl);
            info.appendChild(weatherEl);

            const tempEl = document.createElement("div");
            tempEl.className = "city-temp";
            tempEl.textContent = `${tempText}°C`;

            card.appendChild(info);
            card.appendChild(tempEl);

            // ✅ Lägg till kryss-knapp direkt på kortet
            const removeBtn = document.createElement("button");
            removeBtn.className = "remove-btn";
            removeBtn.textContent = "×";
            removeBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // hindra click på card
                this.savedCities = this.savedCities.filter(
                    c => !(c.name === city.name && c.country === city.country)
                );
                this.saveCities();
                this.renderSavedCities();
            });
            card.appendChild(removeBtn);

            // Klick eller Enter: välj stad
            const selectHandler = () => this.selectCity(city);
            card.addEventListener("click", selectHandler);
            card.addEventListener("keydown", e => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectHandler();
                }
            });

            this.savedCitiesContainer.appendChild(card);
        }
    }

    // Väljer stad, sparar och visar väderkort + karta
    async selectCity(cityObj) {
        clearOptions();
        this.cityInput.value = cityObj.name;

        const existingIndex = this.savedCities.findIndex(
            c => c.name === cityObj.name && c.country === cityObj.country
        );

        if (existingIndex === -1) {
            // Max 3 sparade städer
            if (this.savedCities.length >= 4) this.savedCities.shift();
            this.savedCities.push(cityObj);
            this.saveCities();
        } else {
            // Flytta senaste vald stad längst bak
            const [existingCity] = this.savedCities.splice(existingIndex, 1);
            this.savedCities.push(existingCity);
            this.saveCities();
        }

        await this.renderSavedCities();

        const weather = await weatherApi(cityObj.latitude, cityObj.longitude);
        if (!weather) return;

        if (weather.weather && weather.weather[0]) {
            weather.weather[0].description = translateWeatherCode(weather.weather[0].code);
        }

        weather.name = cityObj.name;

        // Visa väderkort
        this.weatherInfo.innerHTML = "";
        const card = new WeatherCard(weather);
        this.weatherInfo.appendChild(card.render());

        // Visa karta
        showMap(cityObj.latitude, cityObj.longitude);
    }
}