// Fonction pour générer le top 5 en fonction d'une statistique
function generateTop5(pals, statKey, containerId) {
    const sorted = [...pals]
      .sort((a, b) => {
        const valA = parseFloat(a.max_stats[statKey].replace(',', '.'));
        const valB = parseFloat(b.max_stats[statKey].replace(',', '.'));
        return valB - valA;
      });
  
    const container = document.getElementById(containerId);
    let displayed = 0;
    let currentRank = 1;
    let lastValue = null;
  
    for (let i = 0; i < sorted.length; i++) {
      const pal = sorted[i];
      const value = parseFloat(pal.max_stats[statKey].replace(',', '.'));
  
      // Si même valeur que la précédente, garder le même rang
      if (lastValue !== null && value !== lastValue) {
        currentRank = displayed + 1;
      }
  
      lastValue = value;
      displayed++;
  
      const card = document.createElement("div");
      card.className = "ranking-card";
      const imageName = pal.nom.toLowerCase().replaceAll('_') + ".png";
      card.innerHTML = `
        <div class="rank">#${currentRank}</div>
        <img src="../img/${imageName}" alt="${pal.nom}" />
        <div class="name">${pal.nom}</div>
        <div class="name">${pal.max_stats[statKey]}</div>
      `;
      card.addEventListener('click', () => {
        sessionStorage.setItem('openPalModal', pal.nom);
        window.location.href = `../liste_pals/liste_pals.html#${encodeURIComponent(pal.nom)}`;
      });      
      container.appendChild(card);
    }
  }
  
  
  // Chargement des données depuis classement_combat.json
  fetch("classement_combat.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors du chargement du fichier JSON");
      }
      return response.json();
    })
    .then((data) => {
      generateTop5(data, "pv", "hp-list");
      generateTop5(data, "def", "defense-list");
      generateTop5(data, "atk", "damage-list");
    })
    .catch((error) => {
      console.error("Erreur :", error);
    });
  