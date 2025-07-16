document.addEventListener("DOMContentLoaded", async () => {
    const tipsList = document.getElementById("tips-list");
    const typeSelect = document.getElementById("type-select");

    try {
        const response = await fetch("tips.json");
        if (!response.ok) throw new Error("Impossible de charger tips.json");

        const tips = await response.json();

        // Extraire les types uniques
        const types = [...new Set(tips.map(t => t.type))];
        types.sort();

        // Remplir le select
        types.forEach(type => {
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            typeSelect.appendChild(option);
        });

        // Fonction d'affichage des astuces
        function renderTips(filteredType = "all") {
            tipsList.innerHTML = "";
            const filteredTips = filteredType === "all" ? tips : tips.filter(t => t.type === filteredType);

            if (filteredTips.length === 0) {
                tipsList.textContent = "Aucune astuce disponible pour ce type.";
                return;
            }

            filteredTips.forEach(tip => {
                const card = document.createElement("div");
                card.className = "tip-card";

                const typeElem = document.createElement("div");
                typeElem.className = "tip-type";
                typeElem.textContent = `[${tip.type}]`;

                const tipElem = document.createElement("div");
                tipElem.className = "tip-text";
                tipElem.textContent = tip.tips;

                card.appendChild(typeElem);
                card.appendChild(tipElem);
                tipsList.appendChild(card);
            });
        }

        typeSelect.addEventListener("change", () => {
            renderTips(typeSelect.value);
        });

        renderTips(); // Afficher tout par défaut
    } catch (error) {
        console.error("Erreur :", error);
        tipsList.textContent = "Erreur lors du chargement des conseils.";
    }
});
