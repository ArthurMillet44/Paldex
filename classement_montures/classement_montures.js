let palsData = [];
let max_endurance = 410;
let max_vitesse = 3300;
let activeTypes = new Set(["terrestre", "volante", "aquatique"]);

function createTypeFilters() {
  const types = ["terrestre", "volante", "aquatique"];
  const container = document.createElement("div");
  container.id = "type-filters";
  container.style.cssText = "display: flex; justify-content: center; gap: 20px; margin-top: 15px;";

  types.forEach(type => {
    const label = document.createElement("label");
    label.style.cssText = "display: flex; align-items: center; font-weight: bold; cursor: pointer;";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.value = type;
    checkbox.style.marginRight = "5px";

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) activeTypes.add(type);
      else activeTypes.delete(type);
      refreshDisplay();
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(type.charAt(0).toUpperCase() + type.slice(1)));
    container.appendChild(label);
  });

  const h1 = document.querySelector("h1");
  if (h1 && h1.parentNode) {
    h1.parentNode.insertBefore(container, h1.nextSibling);
  } else {
    document.body.insertBefore(container, document.body.firstChild);
  }
}


function filterByType(pals) {
  return pals.filter(pal => {
    const type = pal.monture.toLowerCase();
    return activeTypes.has(type);
  });
}

function generateTop5(pals, statKey, containerId) {
  const filtered = filterByType(pals);
  const sorted = [...filtered].sort((a, b) => {
    const valA = parseFloat(a.base_stats[statKey].replace(',', '.'));
    const valB = parseFloat(b.base_stats[statKey].replace(',', '.'));
    return valB - valA;
  });

  const container = document.getElementById(containerId);
  container.innerHTML = '';

  let displayed = 0;
  let currentRank = 1;
  let lastValue = null;

  for (let i = 0; i < sorted.length; i++) {
    const pal = sorted[i];
    const value = parseFloat(pal.base_stats[statKey].replace(',', '.'));

    if (lastValue !== null && value !== lastValue) {
      currentRank = displayed + 1;
    }

    lastValue = value;
    displayed++;

    const card = document.createElement("div");
    card.className = "ranking-card";

    card.innerHTML = `
      <div class="rank">#${currentRank}</div>
      <img src="../img/${pal.nom}.png" alt="${pal.nom}" />
      <div class="name">${pal.nom}</div>
      <div class="name">${value}</div>
    `;

    card.addEventListener('click', () => {
      sessionStorage.setItem('openPalModal', pal.nom);
      window.location.href = `../liste_pals/liste_pals.html#${encodeURIComponent(pal.nom)}`;
    });

    container.appendChild(card);

  }
}

function showTop5Modal(pals) {
  const filtered = filterByType(pals);

  const scored = filtered.map(pal => {
    let endurance = parseFloat(pal.base_stats.endurance.replace(',', '.')) || 0;
    let vitesse = parseFloat(pal.base_stats.vitesse_sprint.replace(',', '.')) || 0;

    const score =
      (endurance / max_endurance) * 100 +
      (vitesse / max_vitesse) * 100;

    return {
      ...pal,
      score: score
    };
  });

  const top5 = scored.sort((a, b) => b.score - a.score).slice(0, 5);

  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <span class="close" id="modal-close">&times;</span>
    <h2>Top 5 des meilleures montures</h2>
    <div class="top5-container" style="display: flex; flex-direction: column; gap: 15px;">
      ${top5.map((pal, index) => `
        <div class="ranking-card">
          <div class="rank">#${index + 1}</div>
          <img src="../img/${pal.nom}.png" alt="${pal.nom}" />
          <div class="name">${pal.nom}</div>
          <div class="name">Score : ${pal.score.toFixed(1)}</div>
        </div>
      `).join('')}
    </div>
  `;

  const modal = document.getElementById("top5-modal");
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

function refreshDisplay() {
  generateTop5(palsData, "endurance", "hp-list");
  generateTop5(palsData, "vitesse_sprint", "defense-list");
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("../liste_pals/pals.json")
    .then(response => {
      if (!response.ok) throw new Error("Erreur lors du chargement du fichier JSON");
      return response.json();
    })
    .then(data => {
      palsData = data;
      createTypeFilters();
      refreshDisplay();
    })
    .catch(error => {
      console.error("Erreur :", error);
    });

  const button = document.createElement("a");
  button.textContent = "Podium";
  button.className = "btn-podium";
  button.href = "#";
  Object.assign(button.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "#ffffff",
    color: "black",
    padding: "10px 15px",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
    transition: "background-color 0.3s ease",
    zIndex: "1000"
  });

  button.addEventListener("mouseover", () => button.style.backgroundColor = "#dadddf");
  button.addEventListener("mouseout", () => button.style.backgroundColor = "#ffffff");
  button.addEventListener("click", (e) => {
    e.preventDefault();
    if (palsData.length > 0) showTop5Modal(palsData);
  });

  document.body.appendChild(button);

  const modal = document.createElement("div");
  modal.id = "top5-modal";
  Object.assign(modal.style, {
    display: "none",
    position: "fixed",
    zIndex: "1001",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    overflow: "auto",
    backgroundColor: "rgba(0,0,0,0.4)"
  });

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
