document.addEventListener("DOMContentLoaded", async () => {
    const footer = document.createElement("div");
    footer.id = "tips-footer";

    const tipContainer = document.createElement("div");
    tipContainer.id = "tip-container";
    footer.appendChild(tipContainer);
    document.body.appendChild(footer);

    try {
        const response = await fetch("tips.json");
        if (!response.ok) throw new Error("Erreur lors du chargement de tips.json");

        const tips = await response.json();
        if (!Array.isArray(tips) || tips.length === 0) {
            tipContainer.textContent = "Aucun conseil disponible.";
            return;
        }

        let index = 0;

        function displayTip() {
            const tip = tips[index];
            tipContainer.textContent = `[${tip.type}] ${tip.tips}`;
            index = (index + 1) % tips.length;
        }

        displayTip();
        setInterval(displayTip, 8000);

    } catch (error) {
        tipContainer.textContent = "Impossible de charger les conseils.";
        console.error("Erreur de chargement des conseils :", error);
    }
});
