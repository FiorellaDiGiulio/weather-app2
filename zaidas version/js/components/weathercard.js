// weathercard.js
// ===================================
// Skapar och hanterar väderkort
// ===================================

export class WeatherCard {
    constructor(weatherData) {
        this.data = weatherData; // inkluderar name, main.temp, description, lat, lon
    }

    // 1. Skapa DOM-elementet
    render() {
        const card = document.createElement("div");
        card.classList.add("card");

        // Lat / Lon = unik identitet
        card.dataset.lat = this.data.lat;
        card.dataset.lon = this.data.lon;

        const now = new Date();
        const time = now.toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit"
        });

        card.innerHTML = `
            <section role="region" aria-label="Väder för ${this.data.name}" aria-live="polite">
                <h2 tabindex="0">${this.data.name}</h2>
                <p tabindex="0">
                    <span class="sr-only">Temperatur:</span>
                    ${this.data.main.temp}°C
                </p>
                <p tabindex="0">
                    <span class="sr-only">Väder:</span>
                    ${this.data.weather[0].description}
                </p>
                <p tabindex="0">
                    <span class="sr-only">Senast uppdaterad:</span>
                    Uppdaterad: ${time}
                </p>
            </section>
        `;

        return card;
    }

    // 2. Hantera dubletter + ordning
    static insert(cardElement) {
        const weatherInfo = document.getElementById("weatherInfo");

        const lat = cardElement.dataset.lat;
        const lon = cardElement.dataset.lon;

        // Ta bort alla äldre kort för samma lat/lon
        const oldCards = weatherInfo.querySelectorAll(
            `[data-lat="${lat}"][data-lon="${lon}"]`
        );
        oldCards.forEach(card => card.remove());

        // Lägg nya kortet HÖGST UPP
        weatherInfo.prepend(cardElement);
    }
}
