// weathercard.js
// ===================================
// Skapar och hanterar väderkort
// ===================================

export class WeatherCard {
    constructor(weatherData) {
        this.data = weatherData; // inkluderar name, main.temp, description, lat, lon
    }

    // 1. Skapa DOM-elementet utan innerHTML
    render() {
        const card = document.createElement("div");
        card.classList.add("card");

        // Unik identitet
        card.dataset.lat = this.data.lat;
        card.dataset.lon = this.data.lon;

        const now = new Date();
        const time = now.toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit"
        });

        // === SECTION ===
        const section = document.createElement("section");
        section.setAttribute("role", "region");
        section.setAttribute(
            "aria-label",
            `Väder för ${this.data.name}`
        );
        section.setAttribute("aria-live", "polite");

        // === H2 ===
        const title = document.createElement("h2");
        title.tabIndex = 0;
        title.textContent = this.data.name;

        // === Temperatur ===
        const tempP = document.createElement("p");
        tempP.tabIndex = 0;

        const tempLabel = document.createElement("span");
        tempLabel.classList.add("sr-only");
        tempLabel.textContent = "Temperatur:";

        tempP.appendChild(tempLabel);
        tempP.append(` ${this.data.main.temp}°C`);

        // === Beskrivning ===
        const descP = document.createElement("p");
        descP.tabIndex = 0;

        const descLabel = document.createElement("span");
        descLabel.classList.add("sr-only");
        descLabel.textContent = "Väder:";

        descP.appendChild(descLabel);
        descP.append(` ${this.data.weather[0].description}`);

        // === Tidsstämpel ===
        const timeP = document.createElement("p");
        timeP.tabIndex = 0;

        const timeLabel = document.createElement("span");
        timeLabel.classList.add("sr-only");
        timeLabel.textContent = "Senast uppdaterad:";

        timeP.appendChild(timeLabel);
        timeP.append(` Uppdaterad: ${time}`);

        // === Bygg ihop kortet ===
        section.append(title, tempP, descP, timeP);
        card.appendChild(section);

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
