fetch("agriculture.json")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("pal-container");

    data.forEach((pal) => {
      const card = document.createElement("div");
      card.className = "card";

      const inner = document.createElement("div");
      inner.className = "card-inner";

      const front = document.createElement("div");
      front.className = "card-front";
      front.innerHTML = `
        <img src="${pal.image}" alt="${pal.name}" />
        <h2>${pal.name} ×${pal.quantity}</h2>
      `;

      const back = document.createElement("div");
      back.className = "card-back";
      back.innerHTML = `
        <h3>Passifs</h3>
        <ul>
          ${pal.passives.map(p => `<li>${p}</li>`).join("")}
        </ul>
      `;

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);

      card.addEventListener("click", () => {
        card.classList.toggle("flipped");
      });

      container.appendChild(card);
    });
  });
