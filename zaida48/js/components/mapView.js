// mapView.js
// ===================================
// Renderar en Leaflet-karta i #cityMap
// ===================================

let map = null; // global variabel i modulen

export function showMap(lat, lon) {
    const mapContainer = document.getElementById("cityMap");
    
    // Sätt storlek (liten karta - ditt val 3B)
    mapContainer.style.height = "200px";
    mapContainer.style.width = "100%";

    // Rensa gammal karta (Leaflet kräver remove)
    if (map !== null) {
        map.remove();
    }

    // Skapa ny karta
    map = L.map("cityMap").setView([lat, lon], 11);

    // Lägg till kartlager (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // Lägg till markör
    L.marker([lat, lon]).addTo(map);
}
