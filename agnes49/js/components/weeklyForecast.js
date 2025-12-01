export function renderWeeklyForecast(container, weeklyData) {
    container.innerHTML = ""; // tömmer gammalt innehåll

    if (!weeklyData || !weeklyData.days) return;

    const forecastWrapper = document.createElement("div");
    forecastWrapper.className = "weekly-forecast";

    weeklyData.days.forEach((day, index) => {
        const card = document.createElement("div");
        card.className = "weekly-card";

        const dateEl = document.createElement("div");
        dateEl.className = "day";
        dateEl.textContent = new Date(day).toLocaleDateString("sv-SE", { weekday: "short", day: "numeric" });

        const tempEl = document.createElement("div");
        tempEl.className = "temp";
        tempEl.textContent = `${Math.round(weeklyData.tempMax[index])}° / ${Math.round(weeklyData.tempMin[index])}°`;

        const weatherEl = document.createElement("div");
        weatherEl.className = "weather-code";
        weatherEl.textContent = weeklyData.weatherCode[index]; // du kan använda din translateWeatherCode här

        card.appendChild(dateEl);
        card.appendChild(tempEl);
        card.appendChild(weatherEl);

        forecastWrapper.appendChild(card);
    });

    container.appendChild(forecastWrapper);
}