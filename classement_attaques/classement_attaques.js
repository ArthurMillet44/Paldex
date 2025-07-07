document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('attack-ranking');
    const select = document.getElementById('type-select');
    const exclusiveToggle = document.getElementById('exclusive-toggle');

    let allAttacks = [];

    function normalizeTypeForClass(type) {
        return type
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/ /g, '');
    }

    function renderAttacks(attacks) {
        container.innerHTML = '';
        attacks.forEach((atk, index) => {
            const card = document.createElement('div');
            card.className = 'attack-card ' + normalizeTypeForClass(atk.type);
            card.innerHTML = `
                <div class="img-wrapper">
                    <img class="atk-icon" src="../img/${atk.type}.png" alt="${atk.type}">
                </div>
                <h2>#${index + 1} - ${atk.nom}</h2>
                <p><strong>Type :</strong> ${atk.type}</p>
                <p><strong>Puissance :</strong> ${atk.puissance}</p>
                <p><strong>Cooldown :</strong> ${atk.cooldown}</p>
                <p><strong>DPS :</strong> ${atk.dps}</p>
                <p><strong>Exclusive :</strong> ${atk.Exclusive}</p>
            `;
            container.appendChild(card);
        });
    }
    

    function applyFilters() {
        const selectedType = select.value;
        const showExclusive = exclusiveToggle.checked;

        let filtered = [...allAttacks];

        if (selectedType !== 'Tous') {
            filtered = filtered.filter(atk => atk.type === selectedType);
        }

        if (!showExclusive) {
            filtered = filtered.filter(atk => atk.Exclusive === 'Non');
        }

        renderAttacks(filtered);
    }

    // Chargement initial
    fetch('best_atk.json')
        .then(res => res.json())
        .then(data => {
            allAttacks = data.sort((a, b) => parseFloat(b.dps) - parseFloat(a.dps));
            applyFilters();
        })
        .catch(error => console.error('Erreur chargement JSON :', error));

    // Événements
    select.addEventListener('change', applyFilters);
    exclusiveToggle.addEventListener('change', applyFilters);
});
