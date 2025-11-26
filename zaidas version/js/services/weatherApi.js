// weatherApi.js – ny version för ONVO-API

export async function weatherApi(cityName) {
    const url = `http://stockholm2.onvo.se:81/?city_name=${encodeURIComponent(cityName)}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kunde inte hämta väder från ONVO");

        const data = await res.json();

        // Anpassa detta efter exakt struktur API:t returnerar!
        return {
            name: data.city || cityName,
            main: { temp: data.temperature },
            weather: [
                {
                    description: data.description || "Okänt väder",
                    code: data.code || 0
                }
            ],
            time: data.updated
        };

    } catch (err) {
        console.error("weatherApi error:", err);
        return null;
    }
}
