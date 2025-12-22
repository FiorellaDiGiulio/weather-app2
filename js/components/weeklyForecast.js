import { translateWeatherCode } from "../utility/translate.js";

/**
 * Renderar veckoprognos för en stad i angiven container.
 * Skapar kort för varje dag med datum, temperatur, väder och vind.
 *
 * @param {HTMLElement} container - Elementet där prognosen ska renderas
 * @param {Object} weeklyData - Veckoväderdata med arrays för dagar, tempMax, tempMin, weatherCode och vind
 */
export function renderWeeklyForecast(container, weeklyData) {
    container.textContent = ""; // tömmer gammalt innehåll
    if (!weeklyData || !weeklyData.days) return;

    const title = document.createElement("h3");
    title.textContent = "Veckans väder";
    title.tabIndex = 0;
    container.appendChild(title);

    const forecastWrapper = document.createElement("section");
    forecastWrapper.className = "weekly-forecast";

    weeklyData.days.forEach((day, index) => {
        const card = document.createElement("section");
        card.className = "weekly-card";

        const dateEl = document.createElement("section");
        dateEl.className = "day";
        dateEl.textContent = new Date(day).toLocaleDateString("sv-SE", { weekday: "short", day: "numeric" });
        dateEl.tabIndex = 0;

        const tempEl = document.createElement("section");
        tempEl.className = "temp";
        tempEl.textContent = `${Math.round(weeklyData.tempMax[index])}° / ${Math.round(weeklyData.tempMin[index])}°`;
        tempEl.tabIndex = 0;

        const weatherEl = document.createElement("section");
        weatherEl.className = "weather-code";
        weatherEl.textContent = translateWeatherCode(weeklyData.weatherCode[index]);
        weatherEl.tabIndex = 0;

        const windEl = document.createElement("section");
        windEl.className = "wind";
        windEl.textContent = `💨 ${weeklyData.wind[index]} m/s`;
        windEl.tabIndex = 0;

        card.appendChild(dateEl);
        card.appendChild(weatherEl);
        card.appendChild(tempEl);
        card.appendChild(windEl);

        forecastWrapper.appendChild(card);
    });

    container.appendChild(forecastWrapper);
}
