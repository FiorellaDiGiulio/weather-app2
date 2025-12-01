// drawer.js
export function initDrawer() {
    const drawer = document.getElementById("saveDrawer");
    const handle = document.getElementById("drawerHandle");

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    // Klick för att öppna/stänga
    handle.addEventListener("click", () => {
        drawer.classList.toggle("open");
    });

    // Drag start
    handle.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
    });

    // Drag move
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        currentX = e.clientX;

        const delta = startX - currentX;

        // Dra åt höger => öppna
        if (delta < -40) drawer.classList.add("open");

        // Dra åt vänster => stäng
        if (delta > 40) drawer.classList.remove("open");
    });

    // Drag end
    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
}
