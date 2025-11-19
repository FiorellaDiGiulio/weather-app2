export async function weatherApi(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error("Data kunde inte hämtas...");
    
    const data = await response.json();
    return data;
}


