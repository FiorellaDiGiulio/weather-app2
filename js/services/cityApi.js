/**
 * Modul för att hämta stadsförslag från Open-Meteo Geocoding API.
 * Returnerar alla träffar så att filtrering kan göras i annan modul.
 */

/**
 * Hämtar städer baserat på en söksträng.
 *
 * @param {string} query - Texten som användaren söker efter (t.ex. stadsnamn)
 * @returns {Promise<Array>} En lista med stadsresultat, eller en tom array om inget hittas
 */

export async function cityApi(query) {
    if (!query) return [];

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&language=sv&count=20`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kunde inte söka städer");
        
        const data = await res.json();
        
        if (!data.results) return [];

        return data.results;

    } catch (error) {
        console.error("cityApi error:", error);
        return [];
    }
}
