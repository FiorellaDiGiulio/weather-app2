/**
 * Klass som skapar och hanterar visning av väderkort.
 * Väderkortet byggs med DOM-element (utan innerHTML) och är tillgänglighetsanpassat.
 */
export class WeatherCard {
    /**
     * Skapar ett nytt väderkort.
     *
     * @param {Object} weatherData - Väderdata som används i kortet
     */
    constructor(weatherData) {
        this.data = weatherData;
    }

    /**
     * Skapar och returnerar DOM-elementet för väderkortet.
     *
     * @returns {HTMLElement} Det färdiga väderkortet
     */
    render() {
        const card = document.createElement("div");
        card.classList.add("card");

        card.dataset.lat = this.data.lat;
        card.dataset.lon = this.data.lon;

        const now = new Date();
        const time = now.toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit"
        });

        const section = document.createElement("section");
        section.setAttribute("role", "region");
        section.setAttribute(
            "aria-label",
            `Väder för ${this.data.name}`
        );
        section.setAttribute("aria-live", "polite");

        const title = document.createElement("h2");
        title.tabIndex = 0;
        title.textContent = this.data.name;

        const tempP = document.createElement("p");
        tempP.tabIndex = 0;

        const tempLabel = document.createElement("span");
        tempLabel.classList.add("sr-only");
        tempLabel.textContent = "Temperatur:";

        tempP.appendChild(tempLabel);
        tempP.append(` ${this.data.main.temp}°C`);

        const descP = document.createElement("p");
        descP.tabIndex = 0;

        const descLabel = document.createElement("span");
        descLabel.classList.add("sr-only");
        descLabel.textContent = "Väder:";

        descP.appendChild(descLabel);
        descP.append(` ${this.data.weather[0].description}`);

        const timeP = document.createElement("p");
        timeP.tabIndex = 0;

        const timeLabel = document.createElement("span");
        timeLabel.classList.add("sr-only");
        timeLabel.textContent = "Senast uppdaterad:";

        timeP.appendChild(timeLabel);
        timeP.append(` Uppdaterad: ${time}`);

        section.append(title, tempP, descP, timeP);
        card.appendChild(section);

        return card;
    }

    /**
     * Lägger in ett väderkort i containern och säkerställer
     * att inga dubletter finns för samma latitud och longitud.
     * Det nya kortet placeras högst upp.
     *
     * @param {HTMLElement} cardElement - Väderkortets DOM-element
     */
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
