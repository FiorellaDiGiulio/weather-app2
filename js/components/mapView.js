/**
 * Modul som ansvarar för att rendera en Leaflet-karta i elementet #cityMap.
 * Kartan uppdateras när en ny stad väljs.
 */

let map = null;

/**
 * Visar en karta centrerad på angiven latitud och longitud.
 * Om en karta redan finns tas den bort innan en ny skapas.
 *
 * @param {number} lat - Latitud för stadens position
 * @param {number} lon - Longitud för stadens position
 */
export function showMap(lat, lon) {
    const mapContainer = document.getElementById("cityMap");
    
    mapContainer.style.height = "200px";
    mapContainer.style.width = "100%";

    mapContainer.setAttribute("aria-label", "Karta över vald stad");

    if (map !== null) {
        map.remove();
    }

    map = L.map("cityMap").setView([lat, lon], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map);
}
