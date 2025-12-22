import { weatherApi, weeklyWeatherApi } from "../services/weatherApi.js";
import { translateWeatherCode } from "../utility/translate.js";
import { WeatherCard } from "./weathercard.js";
import { showMap } from "./mapView.js";
import { clearOptions } from "./optionsList.js";
import { renderWeeklyForecast } from "./weeklyForecast.js";

/**
 * Klass som hanterar sparade städer, inklusive rendering,
 * val av stad, lokal lagring och visning av väder, karta och prognos.
 */
export class SavedCitiesManager {
    /**
     * Skapar en ny instans av SavedCitiesManager.
     *
     * @param {HTMLInputElement} cityInput - Inputfältet för stadssökning
     * @param {HTMLElement} savedCitiesContainer - Container för sparade städer
     * @param {HTMLElement} weatherInfo - Container för dagens väder
     * @param {HTMLElement} weeklyContainer - Container för veckoväder
     */

    constructor(cityInput, savedCitiesContainer, weatherInfo, weeklyContainer) {
        this.cityInput = cityInput;
        this.savedCitiesContainer = savedCitiesContainer;
        this.weatherInfo = weatherInfo;
        this.weeklyContainer = weeklyContainer;
        this.savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
    }

    /**
     * Sparar listan med städer till localStorage.
     */
    saveCities() {
        localStorage.setItem("savedCities", JSON.stringify(this.savedCities));
    }
   
    /**
     * Renderar alla sparade städer som kort med aktuell temperatur och väder.
     *
     * @param {boolean} show - Anger om sparade städer ska visas
     * @returns {Promise<void>}
     */
    async renderSavedCities(show = true) {
        this.savedCitiesContainer.textContent = "";

        if (!show || this.savedCities.length === 0) return;

         const title = document.createElement("h2");
            title.textContent = "Senaste sökta städer";
            title.tabIndex = 0;
            this.savedCitiesContainer.appendChild(title);

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


            const card = document.createElement("section");
            card.className = "city-card";
            card.tabIndex = 0;

            const info = document.createElement("section");
            info.className = "city-info";

            const nameEl = document.createElement("section");
            nameEl.className = "city-name";
            nameEl.textContent = `${city.name}, ${city.country}`;

            const weatherEl = document.createElement("section");
            weatherEl.className = "city-weather";
            weatherEl.textContent = weatherText;

            info.appendChild(nameEl);
            info.appendChild(weatherEl);

            const tempEl = document.createElement("section");
            tempEl.className = "city-temp";
            tempEl.textContent = `${tempText}°C`;

            card.appendChild(info);
            card.appendChild(tempEl);

            const removeBtn = document.createElement("button");
            removeBtn.className = "remove-btn";
            removeBtn.textContent = "×";
            removeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.savedCities = this.savedCities.filter(
                    c => !(c.name === city.name && c.country === city.country)
                );
                this.saveCities();
                this.renderSavedCities();
            });

            card.appendChild(removeBtn);

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

    /**
     * Väljer en stad, uppdaterar sparade städer och visar
     * aktuellt väder, karta och veckoprognos.
     *
     * @param {Object} cityObj - Objekt som representerar staden
     * @returns {Promise<void>}
     */
    async selectCity(cityObj) {
        clearOptions();
        this.cityInput.value = cityObj.name;

        const existingIndex = this.savedCities.findIndex(
            c => c.name === cityObj.name && c.country === cityObj.country
        );

        if (existingIndex === -1) {
            if (this.savedCities.length >= 3) this.savedCities.shift();
            this.savedCities.push(cityObj);
            this.saveCities();
        } else {
            const [existingCity] = this.savedCities.splice(existingIndex, 1);
            this.savedCities.push(existingCity);
            this.saveCities();
        }

        await this.renderSavedCities();

        const weather = await weatherApi(cityObj.latitude, cityObj.longitude);
        if (weather) {
            if (weather.weather && weather.weather[0]) {
                weather.weather[0].description = translateWeatherCode(weather.weather[0].code);
            }
            weather.name = cityObj.name;

            this.weatherInfo.textContent = "";
            const card = new WeatherCard(weather);
            this.weatherInfo.appendChild(card.render());
        }

        showMap(cityObj.latitude, cityObj.longitude);

        if (this.weeklyContainer) {
            const weeklyData = await weeklyWeatherApi(cityObj.latitude, cityObj.longitude);
            renderWeeklyForecast(this.weeklyContainer, weeklyData);
        }
    }
}
