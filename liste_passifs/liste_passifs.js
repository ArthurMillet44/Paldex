// Conteneur global pour les données chargées
let data = null;

// Fonction pour afficher les passifs dans une colonne
function afficherPassifs(type, category) {
    if (!data) return; // Pas de données chargées

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
    container.innerHTML = ''; // Vide la liste

    if (!data[key] || !data[key][category]) {
        container.innerHTML = '<p>Aucun passif disponible</p>';
        return;
    }

    const passifs = data[key][category];

    for (const passifKey in passifs) {
        if (passifs.hasOwnProperty(passifKey)) {
            const passif = passifs[passifKey];
            const div = document.createElement('div');
            div.className = 'passif-item';
            div.innerHTML = `<h3>${passif.nom}</h3><p>${passif.Description}</p>`;
            container.appendChild(div);
        }
    }
}

// Fonction d'initialisation après chargement des données JSON
function init() {
    // Afficher combat par défaut dans chaque colonne
    ['legendaire', 'rare', 'commun'].forEach(type => {
        afficherPassifs(type, 'combat');
    });

    // Gestion des clics sur boutons
    document.querySelectorAll('.column').forEach(col => {
        const buttons = col.querySelectorAll('button');
        const colId = col.id;
        let type;
        if (colId.includes('legendaire')) type = 'legendaire';
        else if (colId.includes('rare')) type = 'rare';
        else if (colId.includes('commun')) type = 'commun';

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Désactive tous les boutons de la colonne
                buttons.forEach(b => b.classList.remove('active'));
                // Active le bouton cliqué
                button.classList.add('active');
                // Affiche les passifs correspondant
                afficherPassifs(type, button.getAttribute('data-category'));
            });
        });
    });
}

// Chargement du JSON externe via fetch
fetch('passifs.json')
    .then(response => {
        if (!response.ok) throw new Error("Erreur lors du chargement du fichier JSON");
        return response.json();
    })
    .then(jsonData => {
        data = jsonData[0]; // Ton JSON est un tableau contenant un objet, on prend l'objet à l'index 0
        init();
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert("Impossible de charger les données des passifs.");
    });
