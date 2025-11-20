export async function weatherApi(lat, lon) {
    const url = `http://localhost:8080/api/v1/weather?lat=${lat}&lon=${lon}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kunde inte hämta väder");

        const data = await res.json();

        // Antag att backend returnerar:
        // {
        //   temperature: 7,
        //   description: "Mulet",
        //   updated: "2025-11-02T09:00:00Z"
        // }

        return {
            main: { temp: data.temperature },
            weather: [{ description: data.description }],
            time: data.updated
        };

    } catch (err) {
        console.error("weatherApi error:", err);
        return null;
    }
}
