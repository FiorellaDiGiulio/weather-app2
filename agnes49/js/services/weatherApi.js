// weatherApi.js
// =============================
// Hämtar väderdata från Open-Meteo
// =============================

// =============================
// Dagens väder
// =============================
export async function weatherApi(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kunde inte hämta väder");

        const data = await res.json();

        if (!data.current_weather) {
            throw new Error("API returnerade ingen väderdata");
        }

        const weather = data.current_weather;

        // Returnera ett format som passar WeatherCard
        return {
            name: null, // main.js fyller i detta
            main: {
                temp: weather.temperature
            },
            wind: weather.windspeed,
            weather: [
                {
                    code: weather.weathercode,
                    description: null // utility-modul fixar text
                }
            ],
            time: weather.time
        };

    } catch (error) {
        console.error("weatherApi error:", error);
        return null;
    }
}

// =============================
// Veckoväder
// =============================
export async function weeklyWeatherApi(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=auto`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kunde inte hämta veckoväder");

        const data = await res.json();

        // Returnera ett enklare format för rendering
        return {
            days: data.daily.time,                     // datumsträngar
            tempMax: data.daily.temperature_2m_max,    // max-temp
            tempMin: data.daily.temperature_2m_min,    // min-temp
            weatherCode: data.daily.weathercode,       // väderkod
            precipitation: data.daily.precipitation_sum // nederbörd
        };

    } catch (error) {
        console.error("weeklyWeatherApi error:", error);
        return null;
    }
}