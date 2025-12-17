/**
 * Hämtar aktuellt väder baserat på latitud och longitud.
 * Använder ONVO API och mappar svaret till ett format som liknar OpenWeather.
 *
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {Promise<Object|null>} Ett väderobjekt eller null om något går fel
 */
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
            name: null,
            main: {
                temp: Math.round(data.weather.temperature)
            },
            wind: data.weather.windspeed,
            weather: [
                {
                    code: data.weather.wmo_code,
                    description: null
                }
            ],
            time: data.timestamp
        };

    } catch (error) {
        console.error("weatherApi error:", error);
        return null;
    }
}

/**
 * Hämtar veckoväder inklusive temperatur, vind och nederbörd.
 * Använder Open-Meteo Forecast API.
 *
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {Promise<Object|null>} Ett objekt med daglig väderdata eller null vid fel
 */
export async function weeklyWeatherApi(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,precipitation_sum&timezone=auto`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kunde inte hämta veckoväder");

        const data = await res.json();

        return {
            days: data.daily.time,
            tempMax: data.daily.temperature_2m_max,
            tempMin: data.daily.temperature_2m_min,
            weatherCode: data.daily.weathercode,
            wind: data.daily.windspeed_10m_max,
            precipitation: data.daily.precipitation_sum
        };

    } catch (error) {
        console.error("weeklyWeatherApi error:", error);
        return null;
    }
}
