/**
 * Modul som hanterar växling mellan ljust och mörkt tema.
 * Det valda temat sparas i localStorage och appliceras på HTML-elementet.
 */

const themeToggle = document.getElementById("themeToggle");
const htmlEl = document.documentElement;

/**
 * Sätter valt tema, uppdaterar attribut, localStorage
 * samt ikon och text i temaväxlaren.
 *
 * @param {string} theme - Temat som ska sättas ("light" eller "dark")
 */
function setTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    const icon = theme === "dark" ? "🌞" : "🌙";
    const text = theme === "dark" ? "Ljus" : "mörk";

    themeToggle.querySelector(".toggle-icon").textContent = icon;
    themeToggle.querySelector(".toggle-text").textContent = text;
}

/**
 * Initialiserar temat genom att läsa sparat värde från localStorage.
 */
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

/**
 * Växlar tema när användaren klickar på temaväxlaren.
 */
themeToggle.addEventListener("click", () => {
    const current = htmlEl.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    setTheme(next);
});
