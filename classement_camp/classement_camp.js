let max_vitesse = 1700;
let max_vitesse_transport = 600;
let max_quantite_nourriture = 600;

let palsData = [];

function generateTop5(pals, statKey, containerId) {
  const sorted = [...pals].sort((a, b) => {
    const valA = parseFloat((a[statKey] || "0").toString().replace(',', '.'));
    const valB = parseFloat((b[statKey] || "0").toString().replace(',', '.'));
    return valB - valA;
  });

  const container = document.getElementById(containerId);
  container.innerHTML = '';

  let displayed = 0;
  let currentRank = 1;
  let lastValue = null;

  for (let i = 0; i < sorted.length; i++) {
    const pal = sorted[i];
    const value = parseFloat((pal[statKey] || "0").toString().replace(',', '.'));

    if (isNaN(value)) continue;

    if (lastValue !== null && value !== lastValue) {
      currentRank = displayed + 1;
    }

    lastValue = value;
    displayed++;

    const card = document.createElement("div");
    card.className = "ranking-card";

    const imageName = pal.nom.toLowerCase().replaceAll('_', '') + ".png";

    card.innerHTML = `
      <div class="rank">#${currentRank}</div>
      <img src="../img/${imageName}" alt="${pal.nom}" />
      <div class="name">${pal.nom}</div>
      <div class="name">${pal[statKey]}</div>
    `;

    card.addEventListener('click', () => {
      sessionStorage.setItem('openPalModal', pal.nom);
      window.location.href = `../liste_pals/liste_pals.html#${encodeURIComponent(pal.nom)}`;
    });

    container.appendChild(card);
  }
}

function showTop3Modal(pals) {
  const selectedCompetence = document.getElementById("competence-filter").value;

  const scored = pals.map(pal => {
    let v1 = parseFloat((pal.vitesse || "0").toString().replace(',', '.')) / max_vitesse * 100;
    let v2 = parseFloat((pal.vitesse_transport || "0").toString().replace(',', '.')) / max_vitesse_transport * 100;
    let food = parseFloat((pal.quantite_nourriture || "0").toString().replace(',', '.')) / max_quantite_nourriture * 100;

    let score;
    if (selectedCompetence === "all" || selectedCompetence === "Transport") {
      score = v1 + v2 + food;
    } else {
      score = v1 + food;
    }

    return {
      ...pal,
      score
    };
  });

  const top3 = scored.sort((a, b) => b.score - a.score).slice(0, 5);

  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <span class="close" id="modal-close">&times;</span>
    <h2>Top 5 des meilleurs Pals (Camp)</h2>
    <div class="top3-container" style="display: flex; flex-direction: column; gap: 15px;">
      ${top3.map((pal, index) => `
        <div class="ranking-card">
          <div class="rank">#${index + 1}</div>
          <img src="../img/${pal.nom.toLowerCase().replaceAll('_', '')}.png" alt="${pal.nom}" />
          <div class="name">${pal.nom}</div>
          <div class="name">Score : ${pal.score.toFixed(1)}</div>
        </div>
      `).join('')}
    </div>
  `;

  const modal = document.getElementById("top3-modal");
  modal.style.display = "block";

  document.getElementById("modal-close").onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

function getFilteredPals() {
  const selectedCompetence = document.getElementById("competence-filter").value;
  const onlyNocturne = document.getElementById("exclusive-toggle").checked;

  return palsData.filter(pal => {
    const hasCompetence =
      selectedCompetence === "all" ||
      (pal.competences && Object.keys(pal.competences).includes(selectedCompetence));
    const isNocturne =
      !onlyNocturne || String(pal.nocturne).toLowerCase() === "oui";

    return hasCompetence && isNocturne;
  });
}

function populateCompetenceFilter(pals) {
  const select = document.getElementById("competence-filter");
  const allCompetences = new Set();

  pals.forEach(pal => {
    const competences = pal.competences || {};
    Object.keys(competences).forEach(comp => allCompetences.add(comp));
  });

  // Remplacer "travaux manuels" par "Transport" dans la liste
  if (allCompetences.has("travaux manuels")) {
    allCompetences.delete("travaux manuels");
    allCompetences.add("Transport");
  }

  [...allCompetences].sort().forEach(comp => {
    const option = document.createElement("option");
    option.value = comp;
    option.textContent = comp;
    select.appendChild(option);
  });
}

function applyFiltersAndRender() {
  const selectedCompetence = document.getElementById("competence-filter").value;
  const onlyNocturne = document.getElementById("exclusive-toggle").checked;

  let filtered = palsData;

  if (selectedCompetence !== "all") {
    filtered = filtered.filter(pal =>
      pal.competences && Object.keys(pal.competences).includes(selectedCompetence)
    );
  }

  if (onlyNocturne) {
    filtered = filtered.filter(pal =>
      String(pal.nocturne).toLowerCase() === "oui"
    );
  }

  // Toujours afficher la colonne "vitesse"
  generateTop5(filtered, "vitesse", "hp-list");

  // Afficher ou cacher la colonne "vitesse_transport" selon la compétence
  const defenseList = document.getElementById("defense-list");
  if (selectedCompetence === "all" || selectedCompetence === "Transport") {
    generateTop5(filtered, "vitesse_transport", "defense-list");
    defenseList.style.display = "";
  } else {
    // Vide la liste et ajoute un message
    defenseList.innerHTML = `<div style="font-style: italic; color: #666; padding: 10px;">
      La vitesse de transport n’est pas utile pour la compétence <strong>${selectedCompetence}</strong>.
    </div>`;
    defenseList.style.display = "";
  }

  // Toujours afficher la colonne "quantite_nourriture"
  generateTop5(filtered, "quantite_nourriture", "damage-list");
}

// Chargement des données depuis classement_camp.json
fetch("classement_camp.json")
  .then(response => {
    if (!response.ok) throw new Error("Erreur lors du chargement du fichier JSON");
    return response.json();
  })
  .then(data => {
    palsData = data;
    populateCompetenceFilter(palsData);

    document.getElementById("competence-filter").addEventListener("change", applyFiltersAndRender);
    document.getElementById("exclusive-toggle").addEventListener("change", applyFiltersAndRender);

    applyFiltersAndRender();
  })
  .catch(error => {
    console.error("Erreur :", error);
  });

// Création et gestion du bouton Podium + modal
document.addEventListener("DOMContentLoaded", () => {
  const button = document.createElement("a");
  button.textContent = "Podium";
  button.className = "btn-podium";
  button.href = "#";
  button.style.position = "fixed";
  button.style.top = "20px";
  button.style.right = "20px";
  button.style.backgroundColor = "#ffffff";
  button.style.color = "black";
  button.style.padding = "10px 15px";
  button.style.textDecoration = "none";
  button.style.borderRadius = "5px";
  button.style.fontWeight = "bold";
  button.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
  button.style.transition = "background-color 0.3s ease";
  button.style.zIndex = "1000";

  button.addEventListener("mouseover", () => button.style.backgroundColor = "#dadddf");
  button.addEventListener("mouseout", () => button.style.backgroundColor = "#ffffff");

  button.addEventListener("click", (e) => {
    e.preventDefault();
    if (palsData.length > 0) {
      const filteredPals = getFilteredPals();
      if (filteredPals.length > 0) {
        showTop3Modal(filteredPals);
      }
    }
  });

  document.body.appendChild(button);

  const modal = document.createElement("div");
  modal.id = "top3-modal";
  modal.style.display = "none";
  modal.style.position = "fixed";
  modal.style.zIndex = "1001";
  modal.style.left = "0";
  modal.style.top = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.overflow = "auto";
  modal.style.backgroundColor = "rgba(0,0,0,0.4)";
  modal.innerHTML = `
    <div id="modal-content" style="
      background-color: #fefefe;
      margin: 3% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
      max-width: 600px;
      border-radius: 10px;
      position: relative;
    "></div>
  `;
  document.body.appendChild(modal);
});
