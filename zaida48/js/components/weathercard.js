export class WeatherCard {
    constructor(weatherData) {
        this.data = weatherData;
    }

    render() {
        const wrapper = document.createElement("div");

        wrapper.dataset.lat = this.data.lat;
        wrapper.dataset.lon = this.data.lon;

        const section = document.createElement("section");
        section.classList.add("card");
        section.setAttribute("role", "region");
        section.setAttribute("aria-label", `Väder för ${this.data.name}`);
        section.setAttribute("aria-live", "polite");

        // Titel
        const h2 = document.createElement("h2");
        h2.tabIndex = 0;
        h2.textContent = this.data.name;

        // Temperatur
        const tempP = document.createElement("p");
        tempP.tabIndex = 0;

        const tempLabel = document.createElement("span");
        tempLabel.classList.add("sr-only");
        tempLabel.textContent = "Temperatur:";

        tempP.appendChild(tempLabel);
        tempP.append(` ${this.data.main.temp}°C`);

        // Beskrivning
        const descP = document.createElement("p");
        descP.tabIndex = 0;

        const descLabel = document.createElement("span");
        descLabel.classList.add("sr-only");
        descLabel.textContent = "Väder:";

        descP.appendChild(descLabel);
        descP.append(` ${this.data.weather[0].description}`);

        // Uppdaterad tid
        const timeP = document.createElement("p");
        timeP.tabIndex = 0;

        const timeLabel = document.createElement("span");
        timeLabel.classList.add("sr-only");
        timeLabel.textContent = "Senast uppdaterad:";

        const now = new Date();
        const time = now.toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit"
        });

        timeP.appendChild(timeLabel);
        timeP.append(` Uppdaterad: ${time}`);

        // Bygg ihop kortet
        section.append(h2, tempP, descP, timeP);
        wrapper.appendChild(section);

        return wrapper;
    }

    static insert(cardElement) {
        const weatherInfo = document.getElementById("weatherInfo");

        const lat = cardElement.dataset.lat;
        const lon = cardElement.dataset.lon;

        const oldCards = weatherInfo.querySelectorAll(
            `[data-lat="${lat}"][data-lon="${lon}"]`
        );
        oldCards.forEach(card => card.remove());

        weatherInfo.prepend(cardElement);
    }
}
