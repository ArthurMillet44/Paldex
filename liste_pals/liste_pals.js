document.addEventListener('DOMContentLoaded', function () {
    fetch('pals.json')
        .then(response => response.json())
        .then(data => {
            const palsList = document.getElementById('pals-list');
            const modal = document.getElementById('modal');
            const modalDetails = document.getElementById('modal-details');
            const closeButton = document.querySelector('.close-button');

            function openModalForPal(pal) {
                modalDetails.innerHTML = `
                    <h1>${pal.nom}</h1>
                    <img src="Paldex/img/${pal.nom}.png" alt="${pal.nom}" style="
                        max-width: 300px;
                        width: 100%;
                        height: auto;
                        border-radius: 8px;
                        display: block;
                        margin: 0 auto;
                    ">

                    <div class="tabs">
                        <button class="tab-button active" data-tab="attacks">Attaques de base</button>
                        <button class="tab-button" data-tab="base">Stats de base</button>
                        <button class="tab-button" data-tab="max">Stats maxées</button>
                    </div>

                    <div class="tab-content active" id="attacks">
                        <h1>Meilleures Attaques ${pal.attribut}</h1>
                        ${Object.entries(pal.best_atk).map(([name, details]) => `
                            <div class="attack">
                                <h3>${name}</h3>
                                <p><strong>Type</strong>: ${details.type}</p>
                                <p><strong>Dégats</strong>: ${details.dégats}</p>
                                <p><strong>Cooldown</strong>: ${details.cooldown}</p>
                                <p><strong>Tranférable</strong>: ${details.transferrable}</p>
                                ${details.bonus !== undefined ? `<p><strong>Bonus</strong>: ${details.bonus}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>

                    <div class="tab-content" id="base">
                        <div class="info-section">
                            <h3>Stats de base</h3>
                            <p><strong>PV</strong>: ${pal.base_stats.pv}</p>
                            <p><strong>Défense</strong>: ${pal.base_stats.def}</p>
                            <p><strong>Attaque</strong>: ${pal.base_stats.attaque_dist}</p>
                            <p><strong>Endurance</strong>: ${pal.base_stats.endurance}</p>
                        </div>
                    </div>

                    <div class="tab-content" id="max">
                        <div class="info-section">
                            <h3>Stats maxées</h3>
                            <p>PV: ${pal.max_stats.pv}</p>
                            <p>Défense: ${pal.max_stats.def}</p>
                            <p>Attaque: ${pal.max_stats.atk}</p>
                        </div>

                        <div class="info-section">
                            <h3>Boosts</h3>
                            <p>Confiance: ${pal.dps_max.confiance}</p>
                            <p>Étoiles: ${pal.dps_max.etoiles}</p>
                            <p>Niveau: ${pal.dps_max.niveau}</p>
                            <p>Alpha: Oui</p>
                            <p>Âmes de pal: 60%Pv 60%Def 60%Atk</p>
                        </div>

                        <div class="info-section">
                            <h3>Passifs</h3>
                            <p>${pal.dps_max.passifs.premier_passif}</p>
                            <p>${pal.dps_max.passifs.deuxieme_passif}</p>
                            <p>${pal.dps_max.passifs.troisieme_passif}</p>
                            <p>${pal.dps_max.passifs.quatrieme_passif}</p>
                        </div>
                    </div>
                `;

                modal.classList.remove('hidden');

                // Onglets
                const tabButtons = modalDetails.querySelectorAll('.tab-button');
                const tabContents = modalDetails.querySelectorAll('.tab-content');

                tabButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        tabButtons.forEach(b => b.classList.remove('active'));
                        tabContents.forEach(tc => tc.classList.remove('active'));
                        btn.classList.add('active');
                        const target = btn.getAttribute('data-tab');
                        modalDetails.querySelector(`#${target}`).classList.add('active');
                    });
                });
            }

            data.forEach(pal => {
                const palCard = document.createElement('div');
                palCard.className = 'pal-card';
                palCard.innerHTML = `
                    <img src="Paldex/img/${pal.nom}.png" alt="${pal.nom}">
                    <div class="info">
                        <h2>${pal.nom}</h2>
                        <p>${pal.attribut}</p>
                    </div>
                `;

                palCard.addEventListener('click', () => {
                    openModalForPal(pal);
                });

                palsList.appendChild(palCard);
            });

            // Si un Pal doit être ouvert via sessionStorage
            const palToOpen = sessionStorage.getItem('openPalModal');
            if (palToOpen) {
                const targetPal = data.find(p => p.nom === palToOpen);
                if (targetPal) {
                    openModalForPal(targetPal);
                }
                sessionStorage.removeItem('openPalModal');
            }

            closeButton.addEventListener('click', () => {
                modal.classList.add('hidden');
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
