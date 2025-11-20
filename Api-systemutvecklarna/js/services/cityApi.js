export async function cityApi(city) {
    if (!city) return [];

    const url = `http://localhost:8080/api/v1/geo?city=${encodeURIComponent(city)}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kunde inte hämta koordinater");

        const data = await res.json();

        // Förväntat svar från systemutvecklarna:
        // { lat: 59.3, lon: 18.0, name: "Stockholm", country: "SE" }

        return [data]; // Viktigt! Din dropdown förväntar sig en array

    } catch (err) {
        console.error("cityApi error:", err);
        return [];
    }
}
