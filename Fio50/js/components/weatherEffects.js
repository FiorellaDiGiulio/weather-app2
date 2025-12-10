import { setWeatherAnimation } from "./weatherAnimations.js";

// Open-Meteo → animation
export function codeToAnimation(code) {
    if ([0].includes(code)) return "sun";
    if ([1, 2, 3].includes(code)) return "cloud";

    if ([45, 48].includes(code)) return "fog";

    if ([51, 53, 55].includes(code)) return "rain";
    if ([61, 63, 65].includes(code)) return "rain";
    if ([80, 81, 82].includes(code)) return "rain";

    if ([71, 73, 75, 77].includes(code)) return "snow";
    if ([85, 86].includes(code)) return "snow";

    if ([95, 96, 99].includes(code)) return "thunder";

    return "";
}

export function applyWeatherEffects(weather) {
    if (!weather?.weather?.[0]) return;

    const code = weather.weather[0].code;
    const animation = codeToAnimation(code);
    setWeatherAnimation(animation);
}
