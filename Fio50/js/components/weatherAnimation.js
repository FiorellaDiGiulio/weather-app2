const bg = document.querySelector('.weather-background');

function clearWeatherEffects() { bg.innerHTML = ""; }

function startRain() {
  clearWeatherEffects();
  for(let i=0;i<150;i++){
    const drop=document.createElement('div');
    drop.classList.add('rain');
    drop.style.left = Math.random()*100+'vw';
    drop.style.animationDuration = (0.5+Math.random())+'s';
    drop.style.animationDelay = Math.random()+'s';
    bg.appendChild(drop);
  }
}

function startSnow() {
  clearWeatherEffects();
  for(let i=0;i<100;i++){
    const flake=document.createElement('div');
    flake.classList.add('snow');
    flake.style.left = Math.random()*100+'vw';
    flake.style.animationDuration = (3+Math.random()*5)+'s';
    flake.style.animationDelay = Math.random()+'s';
    bg.appendChild(flake);
  }
}

function startSun() {
  clearWeatherEffects();
  const sun=document.createElement('div');
  sun.classList.add('sun-glow');
  bg.appendChild(sun);
}

function startClouds() {
  clearWeatherEffects();
  for(let i=0;i<6;i++){
    const cloud=document.createElement('div');
    cloud.classList.add('cloud');
    cloud.style.top = 10 + i*15 + 'vh';
    cloud.style.animationDuration = (40 + Math.random()*40)+'s';
    bg.appendChild(cloud);
  }
}

function startFog() {
  clearWeatherEffects();
  const fog=document.createElement('div');
  fog.classList.add('fog');
  bg.appendChild(fog);
}

function startLightning() {
  clearWeatherEffects();
  const flash=document.createElement('div');
  flash.classList.add('lightning');
  bg.appendChild(flash);
}

export function setWeatherAnimation(condition){
  condition = condition.toLowerCase();
  if(condition.includes('rain') || condition.includes('drizzle')) return startRain();
  if(condition.includes('snow')) return startSnow();
  if(condition.includes('thunder') || condition.includes('storm')) return startLightning();
  if(condition.includes('cloud')) return startClouds();
  if(condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) return startFog();
  if(condition.includes('clear')) return startSun();
  clearWeatherEffects();
}
