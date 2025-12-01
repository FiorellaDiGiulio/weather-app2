// components/theme.js
const themeToggle = document.getElementById("themeToggle");
const htmlEl = document.documentElement;

function setTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    const icon = theme === "dark" ? "🌙" : "🌞";
    const text = theme === "dark" ? "Mörk" : "Ljus";

    themeToggle.querySelector(".toggle-icon").textContent = icon;
    themeToggle.querySelector(".toggle-text").textContent = text;
}

// Init: läs från localStorage
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

// Event: toggle
themeToggle.addEventListener("click", () => {
    const current = htmlEl.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    setTheme(next);
});
