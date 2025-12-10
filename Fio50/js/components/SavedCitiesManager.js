import { weatherApi, weeklyWeatherApi } from "../services/weatherApi.js";
import { translateWeatherCode } from "../utility/translate.js";
import { WeatherCard } from "./weathercard.js";
import { showMap } from "./mapView.js";
import { clearOptions } from "./optionsList.js";
import { renderWeeklyForecast } from "./weeklyForecast.js";
import { applyWeatherEffects } from "./weatherEffects.js";

export class SavedCitiesManager {
    constructor(cityInput, savedCitiesContainer, weatherInfo, weeklyContainer) {
        this.cityInput = cityInput;
        this.savedCitiesContainer = savedCitiesContainer;
        this.weatherInfo = weatherInfo;
        this.weeklyContainer = weeklyContainer;
        this.savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
    }

    saveCities() {
        localStorage.setItem("savedCities", JSON.stringify(this.savedCities));
    }

    async renderSavedCities(show = true) {
        this.savedCitiesContainer.innerHTML = "";
        if (!show || this.savedCities.length === 0) return;

        const weatherPromises = this.savedCities.map(city =>
            weatherApi(city.latitude, city.longitude)
        );

        const weatherData = await Promise.all(weatherPromises);

        this.savedCities.forEach((city, index) => {
            const weather = weatherData[index];
            let weatherText = "";
            let tempText = 0;

            if (weather?.weather?.[0]) {
                weatherText = translateWeatherCode(weather.weather[0].code);
                tempText = Math.round(weather.main.temp);
            }

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

            // Remove-knapp
            const removeBtn = document.createElement("button");
            removeBtn.className = "remove-btn";
            removeBtn.textContent = "×";
            removeBtn.addEventListener("click", e => {
                e.stopPropagation();
                this.savedCities = this.savedCities.filter(
                    c => !(c.name === city.name && c.country === city.country)
                );
                this.saveCities();
                this.renderSavedCities();
            });

            card.appendChild(removeBtn);

            // Klick för att välja stad
            const selectHandler = () => this.selectCity(city);
            card.addEventListener("click", selectHandler);

            this.savedCitiesContainer.appendChild(card);
        });
    }

    async selectCity(cityObj) {
        clearOptions();
        this.cityInput.value = cityObj.name;

        // Spara stad (max 3 nyligen använda)
        const index = this.savedCities.findIndex(
            c => c.name === cityObj.name && c.country === cityObj.country
        );

        if (index === -1) {
            if (this.savedCities.length >= 3) this.savedCities.shift();
            this.savedCities.push(cityObj);
        } else {
            const [c] = this.savedCities.splice(index, 1);
            this.savedCities.push(c);
        }

        this.saveCities();
        await this.renderSavedCities();

        // Hämta väder
        const weather = await weatherApi(cityObj.latitude, cityObj.longitude);

        if (weather?.weather?.[0]) {
            weather.weather[0].description = translateWeatherCode(weather.weather[0].code);

            // 🌟 Starta animation
            applyWeatherEffects(weather);
        }

        // Visa väderkort
        this.weatherInfo.innerHTML = "";
        const card = new WeatherCard(weather);
        this.weatherInfo.appendChild(card.render());

        // Visa karta
        showMap(cityObj.latitude, cityObj.longitude);

        // Veckoväder
        if (this.weeklyContainer) {
            const weeklyData = await weeklyWeatherApi(cityObj.latitude, cityObj.longitude);
            renderWeeklyForecast(this.weeklyContainer, weeklyData);
        }
    }
}
