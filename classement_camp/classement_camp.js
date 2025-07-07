let palsData = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("./classement_camp.json"); // adapte le chemin selon ton projet
    if (!response.ok) throw new Error("Erreur lors du chargement du fichier JSON");

    palsData = await response.json();

    populateCompetenceFilter(palsData);

    document.getElementById("competence-filter").addEventListener("change", applyFiltersAndRender);
    document.getElementById("exclusive-toggle").addEventListener("change", applyFiltersAndRender);

    document.getElementById("close-modal").addEventListener("click", () => {
      document.getElementById("details-modal").classList.add("hidden");
    });

    document.getElementById("details-modal").addEventListener("click", (event) => {
      const modalContent = document.querySelector(".modal-content");
      if (!modalContent.contains(event.target)) {
        document.getElementById("details-modal").classList.add("hidden");
      }
    });

    applyFiltersAndRender();
  } catch (error) {
    console.error("Erreur de chargement JSON :", error);
  }
});

function getFilteredPals() {
  const selectedCompetence = document.getElementById("competence-filter").value;
  const onlyNocturne = document.getElementById("exclusive-toggle").checked;

  return palsData.filter(pal => {
    const competences = pal.competences || {};
    const hasCompetence = Object.keys(competences).includes(selectedCompetence);
    const isNocturne = !onlyNocturne || String(pal.nocturne).toLowerCase() === "oui";

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

  const sortedCompetences = [...allCompetences].sort();
  sortedCompetences.forEach(comp => {
    const option = document.createElement("option");
    option.value = comp;
    option.textContent = comp;
    select.appendChild(option);
  });

  if (sortedCompetences.length > 0) {
    select.value = sortedCompetences[0];
  }
}

function renderPalsByClassement(filteredPals) {
  const list = document.getElementById("main-list");
  list.innerHTML = "";

  const sorted = filteredPals
    .filter(pal => pal.classement !== undefined)
    .sort((a, b) => a.classement - b.classement);

  sorted.forEach(pal => {
    const card = document.createElement("div");
    card.className = "ranking-card";

    const imageName = pal.nom + ".png";

    card.innerHTML = `
      <div class="rank">#${pal.classement}</div>
      <img src="../img/${imageName}" alt="${pal.nom}" />
      <div class="name">${pal.nom}</div>
      <button class="detail-button" data-pal='${JSON.stringify(pal)}'>Détail</button>
    `;

    list.appendChild(card);
  });

  document.querySelectorAll(".detail-button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const pal = JSON.parse(e.currentTarget.dataset.pal);
      showDetailModal(pal);
    });
  });
}

function showDetailModal(pal) {
  const modal = document.getElementById("details-modal");
  const body = document.getElementById("modal-body");

  const allCompetences = {
    ...(pal.competences || {})
  };

  const competencesHTML = Object.entries(allCompetences)
    .map(([key, value]) => `${key} : ${value === true ? "Oui" : value}`)
    .join(", ");

  const imageName = pal.nom + ".png";

  const reasons = `
    <h3>${pal.nom}</h3>
    <img src="../img/${imageName}" alt="${pal.nom}" style="
      max-width: 150px;
      width: 100%;
      height: auto;
      border-radius: 8px;
      display: block;
      margin: 0 auto;
    ">
    <p><strong>Compétences :</strong> ${competencesHTML}</p>
    <p><strong>Vitesse :</strong> ${pal.vitesse}</p>
    <p><strong>Vitesse transport :</strong> ${pal.vitesse_transport}</p>
    <p><strong>Quantité de nourriture :</strong> ${pal.quantite_nourriture}</p>
    <p><strong>Nocturne :</strong> ${pal.nocturne}</p>
    ${pal.description ? `<p><strong>Description :</strong> ${pal.description}</p>` : ""}
  `;

  body.innerHTML = reasons;
  modal.classList.remove("hidden");
}

function applyFiltersAndRender() {
  const filtered = getFilteredPals();
  renderPalsByClassement(filtered);

  // Mise à jour du titre <h2> selon la compétence sélectionnée
  const selectedCompetence = document.getElementById("competence-filter").value;
  const title = document.getElementById("ranking-title");
  if (title) {
    title.textContent = `Top 3 - ${selectedCompetence}`;
  }
}
