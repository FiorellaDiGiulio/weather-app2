// weatherAnimations.js – ultra realistisk animationsmotor

export function setWeatherAnimation(type) {
    const container = document.getElementById("weather-animation");
    if (!container) return;

    // Rensa tidigare animationer
    container.innerHTML = "";

    switch (type) {

        /* solstrålar */
        case "sun": {
            // ⭐ ENDAST strålar - ingen sol
            const rays = document.createElement("div");
            rays.className = "sun-rays";
            container.appendChild(rays);
            break;
}


        /* ☁️ MOLN (parallaxdjup) */
        case "cloud": {
            const layers = [
                { amount: 3, speed: 40, opacity: 0.5, scale: 1 },
                { amount: 2, speed: 25, opacity: 0.8, scale: 1.15 }
            ];

            layers.forEach(layer => {
                for (let i = 0; i < layer.amount; i++) {
                    const cloud = document.createElement("div");
                    cloud.className = "cloud";
                    cloud.style.setProperty("--speed", `${layer.speed + Math.random() * 20}s`);
                    cloud.style.opacity = layer.opacity;
                    cloud.style.transform = `scale(${layer.scale})`;
                    cloud.style.left = `${Math.random() * 100}vw`;
                    cloud.style.top = `${Math.random() * 40}vh`;
                    container.appendChild(cloud);
                }
            });

            break;
        }

        /* 🌧️ REALISTISKT REGN */
        case "rain": {
            for (let i = 0; i < 200; i++) {
                const drop = document.createElement("div");
                drop.className = "raindrop";

                drop.style.left = `${Math.random() * 100}vw`;
                drop.style.top = `${Math.random() * -20}vh`;
                drop.style.setProperty("--speed", `${0.4 + Math.random() * 0.8}s`);
                drop.style.setProperty("--wind", `${Math.random() * 10 - 5}px`);

                container.appendChild(drop);

                // spår av regn på skärmen
                if (Math.random() < 0.15) {
                    const trail = document.createElement("div");
                    trail.className = "raindrop-trail";
                    trail.style.left = `${Math.random() * 100}vw`;
                    container.appendChild(trail);
                }
            }

            // Vindpartiklar
            for (let i = 0; i < 15; i++) {
                const p = document.createElement("div");
                p.className = "wind-particle";
                p.style.top = `${Math.random() * 100}vh`;
                p.style.setProperty("--speed", `${4 + Math.random() * 4}s`);
                p.style.setProperty("--rise", `${-20 + Math.random() * 40}px`);
                container.appendChild(p);
            }

            break;
        }

        /* 🌨️ REALISTISK SNÖ */
        case "snow": {
            for (let i = 0; i < 90; i++) {
                const flake = document.createElement("div");
                flake.className = "snowflake";
                flake.textContent = "❄";

                flake.style.left = `${Math.random() * 100}vw`;
                flake.style.top = `${Math.random() * -20}vh`;
                flake.style.setProperty("--size", `${10 + Math.random() * 20}px`);
                flake.style.setProperty("--speed", `${3 + Math.random() * 6}s`);
                flake.style.setProperty("--drift", `${Math.random() * 50 - 25}px`);

                container.appendChild(flake);
            }

            break;
        }

        /* 🌫️ REALISTISK DIMMA */
        case "fog": {
            for (let i = 0; i < 2; i++) {
                const fog = document.createElement("div");
                fog.className = "fog";
                fog.style.setProperty("--speed", `${20 + Math.random() * 15}s`);
                fog.style.opacity = 0.20 + Math.random() * 0.15;
                container.appendChild(fog);
            }
            break;
        }

        /* ⚡ ÅSKA (blixt + regn + vind) */
        case "thunder": {
            const flash = document.createElement("div");
            flash.className = "thunder-flash";
            flash.style.setProperty("--speed", `${2 + Math.random() * 3}s`);
            flash.style.setProperty("--intensity", `${0.3 + Math.random() * 0.7}`);
            container.appendChild(flash);

            // Ösregn under åskväder
            for (let i = 0; i < 160; i++) {
                const drop = document.createElement("div");
                drop.className = "raindrop";
                drop.style.left = `${Math.random() * 100}vw`;
                drop.style.setProperty("--speed", `${0.3 + Math.random() * 0.7}s`);
                drop.style.setProperty("--wind", `${Math.random() * 20 - 10}px`);
                container.appendChild(drop);
            }

            break;
        }

        /* default */
        default:
            container.innerHTML = "";
    }
}
