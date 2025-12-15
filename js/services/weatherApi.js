export async function weatherApi(lat, lon) {
    const url = `http://stockholm2.onvo.se/api/v1/weather?lat=${lat}&lon=${lon}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kunde inte hämta väder");

        const data = await res.json();
        console.log("ONVO raw data:", data);

        if (!data.weather) {
            console.warn("Ingen weather i svaret:", data);
            return null;
        }

        return {
            name: null, // sätts senare
            main: {
                temp: Math.round(data.weather.temperature)
            },
            wind: data.weather.windspeed,
            weather: [
                {
                    code: data.weather.wmo_code, // ⬅️ denna är VIKTIG
                    description: null             // översätts senare
                }
            ],
            time: data.timestamp
        };

    } catch (error) {
        console.error("weatherApi error:", error);
        return null;
    }
}

// =============================
// Veckoväder med vind
// =============================
export async function weeklyWeatherApi(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,precipitation_sum&timezone=auto`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kunde inte hämta veckoväder");

        const data = await res.json();

        return {
            days: data.daily.time,                      // datumsträngar
            tempMax: data.daily.temperature_2m_max,     // max-temp
            tempMin: data.daily.temperature_2m_min,     // min-temp
            weatherCode: data.daily.weathercode,        // väderkod
            wind: data.daily.windspeed_10m_max,         // vind
            precipitation: data.daily.precipitation_sum // nederbörd
        };

    } catch (error) {
        console.error("weeklyWeatherApi error:", error);
        return null;
    }
}