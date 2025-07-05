// Données JSON
let data = null;

// Catégorie active pour chaque type de rareté
let currentCategories = {
    commun: 'combat',
    rare: 'combat',
    legendaire: 'combat'
};

// Fonction d’affichage
function afficherPassifs(type) {
    const category = currentCategories[type];
    if (!data) return;

    const listId = {
        legendaire: 'legendaire-list',
        rare: 'rare-list',
        commun: 'commun-list'
    };

    let key;
    if (type === 'legendaire') key = 'passifs_legendaires';
    else if (type === 'rare') key = 'passifs_rares';
    else if (type === 'commun') key = 'passifs_communs';

    const container = document.getElementById(listId[type]);
    container.innerHTML = '';

    if (!data[key] || !data[key][category]) {
        container.innerHTML = '<p>Aucun passif disponible</p>';
        return;
    }

    const passifs = Object.values(data[key][category]);
    const maxInitial = 3;
    const hasMore = passifs.length > maxInitial;

    const visiblePassifs = hasMore ? passifs.slice(0, maxInitial) : passifs;
    const hiddenPassifs = hasMore ? passifs.slice(maxInitial) : [];

    visiblePassifs.forEach(passif => {
        const div = document.createElement('div');
        div.className = 'passif-item';
        div.innerHTML = `<h3>${passif.nom}</h3><p>${passif.Description}</p>`;
        container.appendChild(div);
    });

    if (hasMore) {
        const hiddenContainer = document.createElement('div');
        hiddenContainer.className = 'hidden-passifs';
        hiddenContainer.style.display = 'none';

        hiddenPassifs.forEach(passif => {
            const div = document.createElement('div');
            div.className = 'passif-item';
            div.innerHTML = `<h3>${passif.nom}</h3><p>${passif.Description}</p>`;
            hiddenContainer.appendChild(div);
        });

        container.appendChild(hiddenContainer);

        const btn = document.createElement('button');
        btn.className = 'voir-plus-btn';
        btn.textContent = 'Voir plus';

        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isHidden = hiddenContainer.style.display === 'none';
            hiddenContainer.style.display = isHidden ? 'block' : 'none';
            btn.textContent = isHidden ? 'Voir moins' : 'Voir plus';
        });

        container.appendChild(btn);
    }
}

// Initialisation
function init() {
    ['legendaire', 'rare', 'commun'].forEach(type => {
        afficherPassifs(type);

        // Ciblage des boutons dans la bonne colonne
        document.querySelectorAll(`#${type}-column .buttons button`).forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                currentCategories[type] = category;

                // Met à jour les boutons actifs uniquement pour cette colonne
                document.querySelectorAll(`#${type}-column .buttons button`).forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');

                afficherPassifs(type);
            });
        });
    });
}

// Chargement des données
fetch('passifs.json')
    .then(response => {
        if (!response.ok) throw new Error("Erreur de chargement JSON");
        return response.json();
    })
    .then(jsonData => {
        data = jsonData[0];
        init();
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert("Erreur lors du chargement des passifs.");
    });
