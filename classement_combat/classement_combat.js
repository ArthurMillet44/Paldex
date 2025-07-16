let max_vie = 17446;
let max_def = 2477;
let max_atk = 3422;
let palsData = [];

function generateTop5(pals, statKey, containerId) {
  const checkbox = document.getElementById('exclusive-toggle');
  const useActiveStats = checkbox.checked;

  const sorted = [...pals].sort((a, b) => {
    const valA = parseFloat((useActiveStats && a.active ? a.active[statKey] : a.max_stats[statKey]).replace(',', '.'));
    const valB = parseFloat((useActiveStats && b.active ? b.active[statKey] : b.max_stats[statKey]).replace(',', '.'));
    return valB - valA;
  });

  const container = document.getElementById(containerId);
  container.innerHTML = '';

  let displayed = 0;
  let currentRank = 1;
  let lastValue = null;

  for (let i = 0; i < sorted.length; i++) {
    const pal = sorted[i];
    const value = parseFloat((useActiveStats && pal.active ? pal.active[statKey] : pal.max_stats[statKey]).replace(',', '.'));

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

function showTop3Modal(pals) {
  const checkbox = document.getElementById('exclusive-toggle');
  const useActiveStats = checkbox.checked;

  const scored = pals.map(pal => {
    let pv = parseFloat((useActiveStats && pal.active ? pal.active.pv : pal.max_stats.pv).replace(',', '.'));
    let def = parseFloat((useActiveStats && pal.active ? pal.active.def : pal.max_stats.def).replace(',', '.'));
    let atk = parseFloat((useActiveStats && pal.active ? pal.active.atk : pal.max_stats.atk).replace(',', '.'));

    pv = pv / max_vie * 100;
    def = def / max_def * 100;
    atk = atk / max_atk * 100;

    return {
      ...pal,
      score: pv + def + atk
    };
  });

  const top3 = scored.sort((a, b) => b.score - a.score).slice(0, 5);

  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <span class="close" id="modal-close">&times;</span>
    <h2>Top 5 des meilleurs Pals</h2>
    <div class="top3-container" style="display: flex; flex-direction: column; gap: 15px;">
      ${top3.map((pal, index) => `
        <div class="ranking-card">
          <div class="rank">#${index + 1}</div>
          <img src="../img/${pal.nom}.png" alt="${pal.nom}" />
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

function refreshAllStats() {
  generateTop5(palsData, "pv", "hp-list");
  generateTop5(palsData, "def", "defense-list");
  generateTop5(palsData, "atk", "damage-list");
}

fetch("classement_combat.json")
  .then(response => {
    if (!response.ok) throw new Error("Erreur lors du chargement du fichier JSON");
    return response.json();
  })
  .then(data => {
    palsData = data;
    refreshAllStats();
  })
  .catch(error => {
    console.error("Erreur :", error);
  });

document.addEventListener("DOMContentLoaded", () => {
  // Podium button
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
    if (palsData.length > 0) {
      showTop3Modal(palsData);
    }
  });

  document.body.appendChild(button);

  // Modal container
  const modal = document.createElement("div");
  modal.id = "top3-modal";
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

  // Checkbox listener
  const checkbox = document.getElementById('exclusive-toggle');
  if (checkbox) {
    checkbox.addEventListener('change', () => {
      refreshAllStats();
    });
  }
});
