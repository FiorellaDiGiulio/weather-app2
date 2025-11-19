export class WeatherCard {
  constructor(weatherData) {
    this.weatherData = weatherData;
  }

  render() {
    const now = new Date();
    const time = now.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <section role="region" aria-label="Väder för ${this.weatherData.name}" aria-live="polite">
        <h2 tabindex="0">${this.weatherData.name}</h2>
        <p tabindex="0">
          <span class="sr-only">Temperatur:</span>
          ${this.weatherData.main.temp}°C
        </p>
        <p tabindex="0">
          <span class="sr-only">Beskrivning:</span>
          ${this.weatherData.weather[0].description}
        </p>
        <p tabindex="0">
          <span class="sr-only">Senast uppdaterad:</span>
          Senast uppdaterad: ${time}
        </p>
      </section>
    `;

    return card;
  }
}




