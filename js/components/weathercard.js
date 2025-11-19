export class weathercard {
    constructor (weatherApi) {
        this.weatherApi = weatherApi;
      }
}    

  const card = document.createElement ("div");
  card.classList.add("card");

   card.innerHTML = `
    <section role="region" aria-label="Väder för ${this.weatherApi.name}" aria-live="polite">
    <h2 tabindex="0">${this.weatherApi.name}</h2>
    <p tabindex="0">
      <span class="sr-only">Temperatur:</span>
      ${this.weatherAp.main.temp}°C
    </p>
    <p tabindex="0">
      <span class="sr-only">Beskrivning:</span>
      ${this.weatherApi.weather[0].description}
    </p>
    <p tabindex="0">
      <span class="sr-only">Senast uppdaterad:</span>
      Senast uppdaterad: ${time}
    </p>
  </section>
`;

    return card;
  



