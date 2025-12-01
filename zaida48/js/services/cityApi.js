// cityApi.js
// =============================
// Hämtar stadsförslag från Open-Meteo Geocoding API
// Returnerar ALLA matches så main.js kan filtrera exakt
// =============================

export async function cityApi(query) {
    if (!query) return [];

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&language=sv&count=20`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kunde inte söka städer");
        
        const data = await res.json();
        
        // Om inga resultat → returera tom array
        if (!data.results) return [];

        // Returnera ALLA råa träffar utan magi
        return data.results;

    } catch (error) {
        console.error("cityApi error:", error);
        return [];
    }
}
