export async function weatherApi(lat,lon) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}`;
    const response = await fetch(url);
    
    if (!Response.ok) throw new Error("Data kunde inte hämtas...");

    const data = await response.json();
    return data;

}