// weatherApi.js
// =============================
// Hämtar riktigt väder från Open-Meteo baserat på lat/lon
// Returnerar ett objekt anpassat för WeatherCard
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
            name: null,              // main.js fyller i detta
            main: {
                temp: weather.temperature
            },
            wind: weather.windspeed,
            weather: [
                {
                    code: weather.weathercode,
                    description: null           // utility-modul fixar text
                }
            ],
            time: weather.time
        };

    } catch (error) {
        console.error("weatherApi error:", error);
        return null;
    }
}
