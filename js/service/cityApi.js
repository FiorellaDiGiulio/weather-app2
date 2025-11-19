export async function cityApi (city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
    const response = await fetch(url);

    if(!response.ok) {
        throw new Error("Kunde inte hämta väderdata");   
    }
    
    const data = await response.json();
    return data;
}

