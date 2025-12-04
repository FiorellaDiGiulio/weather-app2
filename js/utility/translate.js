// translate.js
// ==========================================
// Översätter Open-Meteo weather codes till
// svenska väderbeskrivningar.
// ==========================================

export function translateWeatherCode(code) {
    const map = {
       0: "☀️ Klar himmel",
    1: "🌤️ Mestadels klart",
    2: "⛅ Delvis molnigt",
    3: "☁️ Mulet",

    45: "🌫️ Dimma",
    48: "❄️🌫️ Dimma med frost",

    51: "🌦️ Lätt duggregn",
    53: "🌦️ Duggregn",
    55: "🌧️ Kraftigt duggregn",

    56: "🌧️❄️ Lätt underkylt duggregn",
    57: "🌧️❄️ Underkylt duggregn",

    61: "🌦️ Lätt regn",
    63: "🌧️ Regn",
    65: "🌧️🌧️ Kraftigt regn",

    66: "🌧️❄️ Lätt underkylt regn",
    67: "🌧️❄️ Underkylt regn",

    71: "🌨️ Lätt snöfall",
    73: "🌨️ Snöfall",
    75: "❄️🌨️ Kraftigt snöfall",

    77: "❄️ Snökorn",

    80: "🌦️ Lätta regnskurar",
    81: "🌦️ Regnskurar",
    82: "⛈️ Kraftiga regnskurar",

    95: "⛈️ Åska",
    96: "⛈️🌨️ Åska med lätt hagel",
    99: "⛈️❄️ Åska med kraftigt hagel"
    };

    return map[code] || "Okänt väder";
}
