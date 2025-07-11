fetch("petrole.json")
  .then((res) => res.json())
  .then((data) => {
    const agri_container = document.getElementById("pal-agri-container");
    const ranch_container = document.getElementById("pal-ranch-container");
    const pal_inte_container = document.getElementById("pal-inte-container");
    const autre_container = document.getElementById("pal-autre-container");
    const structures_container = document.getElementById("structures-container");
    const storage_container = document.getElementById("storage-container");
    const autre_struct_container = document.getElementById("autre_struct_container")

    data.forEach((pal) => {
  const card = document.createElement("div");
  card.className = "card";

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const front = document.createElement("div");
  front.className = "card-front";
  front.innerHTML = `
    <img src="../../img/${pal.name}.png" alt="${pal.name}" />
    <h2>${pal.name} ×${pal.quantity}</h2>
  `;

  inner.appendChild(front);

  const hasPassives = Array.isArray(pal.passives) && pal.passives.length > 0;

  if (hasPassives) {
    const back = document.createElement("div");
    back.className = "card-back";
    back.innerHTML = `
      <h3>Passifs</h3>
      <ul>
        ${pal.passives.map(p => `<li>${p}</li>`).join("")}
      </ul>
    `;
    inner.appendChild(back);

    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });

    card.style.cursor = "pointer";
  } else {
    card.style.cursor = "default";
  }

  card.appendChild(inner);

  if (pal.type === "agri") {
    agri_container.appendChild(card);
  } else if (pal.type === "ranch") {
    ranch_container.appendChild(card);
  } else if (pal.type === "inte") {
    pal_inte_container.appendChild(card);
  } else if (pal.type === "structure") {
    structures_container.appendChild(card);
  } else if(pal.type === "storage"){
    storage_container.appendChild(card)
  }else if(pal.type === "autre_struct"){
    autre_struct_container.appendChild(card)
  } else {
    autre_container.appendChild(card);
  }
});


    const btnPals = document.getElementById("btn-pals");
    const btnStructures = document.getElementById("btn-structures");
    const sectionPals = document.getElementById("section-pals");
    const sectionStructures = document.getElementById("section-structures");

    btnPals.addEventListener("click", () => {
      sectionPals.style.display = "block";
      sectionStructures.style.display = "none";
    });

    btnStructures.addEventListener("click", () => {
      sectionPals.style.display = "none";
      sectionStructures.style.display = "block";
    });
});
