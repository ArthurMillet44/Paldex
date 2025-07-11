let max_vie = 17446
let max_def = 2477
let max_atk = 3422

function generateTop5(pals, statKey, containerId) {
  const sorted = [...pals].sort((a, b) => {
    const valA = parseFloat(a.max_stats[statKey].replace(',', '.'));
    const valB = parseFloat(b.max_stats[statKey].replace(',', '.'));
    return valB - valA;
  });

  const container = document.getElementById(containerId);
  container.innerHTML = '';

  let displayed = 0;
  let currentRank = 1;
  let lastValue = null;

  for (let i = 0; i < sorted.length; i++) {
    const pal = sorted[i];
    const value = parseFloat(pal.max_stats[statKey].replace(',', '.'));

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
      <div class="name">${pal.max_stats[statKey]}</div>
    `;

    card.addEventListener('click', () => {
      sessionStorage.setItem('openPalModal', pal.nom);
      window.location.href = `../liste_pals/liste_pals.html#${encodeURIComponent(pal.nom)}`;
    });

    container.appendChild(card);
  }
}

function showTop3Modal(pals) {
  const scored = pals.map(pal => {
    let pv = parseFloat(pal.max_stats.pv.replace(',', '.'));
    let def = parseFloat(pal.max_stats.def.replace(',', '.'));
    let atk = parseFloat(pal.max_stats.atk.replace(',', '.'));
    pv = pv/max_vie*100
    def = def/max_def*100
    atk = atk/max_atk*100
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

let palsData = [];

fetch("classement_combat.json")
  .then(response => {
    if (!response.ok) throw new Error("Erreur lors du chargement du fichier JSON");
    return response.json();
  })
  .then(data => {
    palsData = data;
    generateTop5(data, "pv", "hp-list");
    generateTop5(data, "def", "defense-list");
    generateTop5(data, "atk", "damage-list");
  })
  .catch(error => {
    console.error("Erreur :", error);
  });

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
      showTop3Modal(palsData);
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
