// weathercard.js
// ===================================
// Skapar väderkortet som ett DOM-element
// ===================================

export class WeatherCard {
    constructor(weatherData) {
        this.data = weatherData;
    }

    render() {
        const card = document.createElement("div");
        card.classList.add("card");

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
}
