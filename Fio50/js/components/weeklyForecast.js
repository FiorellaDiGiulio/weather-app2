// weeklyForecast.js
import { translateWeatherCode } from "../utility/translate.js";

export function renderWeeklyForecast(container, weeklyData) {
    container.innerHTML = ""; // tömmer gammalt innehåll

    if (!weeklyData || !weeklyData.days) return;

    const forecastWrapper = document.createElement("div");
    forecastWrapper.className = "weekly-forecast"; // vi kan styla som horisontell rad

    weeklyData.days.forEach((day, index) => {
        const card = document.createElement("div");
        card.className = "weekly-card";

        // Datum
        const dateEl = document.createElement("div");
        dateEl.className = "day";
        dateEl.textContent = new Date(day).toLocaleDateString("sv-SE", { weekday: "short", day: "numeric" });

        // Temperatur
        const tempEl = document.createElement("div");
        tempEl.className = "temp";
        tempEl.textContent = `${Math.round(weeklyData.tempMax[index])}° / ${Math.round(weeklyData.tempMin[index])}°`;

        // Väderkod → Emoji + beskrivning
        const weatherEl = document.createElement("div");
        weatherEl.className = "weather-code";
        weatherEl.textContent = translateWeatherCode(weeklyData.weatherCode[index]);

        // Vind
        const windEl = document.createElement("div");
        windEl.className = "wind";
        windEl.textContent = `💨 ${weeklyData.wind[index]} m/s`;

        card.appendChild(dateEl);
        card.appendChild(weatherEl);
        card.appendChild(tempEl);
        card.appendChild(windEl);

        forecastWrapper.appendChild(card);
    });

    container.appendChild(forecastWrapper);
}