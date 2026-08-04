"use strict";

function updateProfilFilter() {
  const imgProfil = document.querySelector('.img__profil');
  const menuAccount = document.querySelector('.menu__account');

  if (!imgProfil || !menuAccount) return;

  const fileName = new URL(imgProfil.src).pathname.split('/').pop();

  const isDefaultImage = fileName === "compte.png";
  const isActivePage = menuAccount.classList.contains("actif");

  if (isDefaultImage && !isActivePage) {
    imgProfil.style.filter = "brightness(1000%)";
  } else {
    imgProfil.style.filter = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetch('/projets/tfe-aout/api/moi.php')
    .then(res => res.json())
    .then(json => {
      if (!json.logged) return;

      const user = json.user;

      const imgProfil = document.querySelector('.img__profil');
      const titleProfil = document.querySelector('.menu__user');

      if (imgProfil) {
        imgProfil.src = user.image;
        imgProfil.onload = updateProfilFilter;
      }

      if (titleProfil) {
        titleProfil.textContent = `${user.nom[0]}. ${user.prenom}`;
      }
    });
  updateProfilFilter();
});

/* NAV */
const boutonMenu = document.getElementById('menu__btn');
const menu = document.querySelector('.nav');

boutonMenu.addEventListener('click', () => {
  menu.classList.toggle('actif');
});

document.addEventListener("DOMContentLoaded", () => {
  const menuAccount = document.querySelector('.menu__account');

  if (!menuAccount) return;

  fetch('/projets/tfe-aout/api/moi.php')
    .then(res => res.json())
    .then(json => {

      if (json.logged) {
        menuAccount.href = "monCompte.html";
      } else {
        menuAccount.href = "index.html";
      }
    });
});

/* Mes voitures */
const fichier = location.pathname.split("/").pop();
if (fichier === "mesVoitures.html") {
  const mesVoitures = document.getElementById('mesVoitures__Container');

  async function chargerVoitures(userId) {

    const response = await fetch(`/projets/tfe-aout/api/voitures.php?userId=${userId}`);
    const result = await response.json();

    // Vérification du succès
    if (!result.success) {
      mesVoitures.innerHTML = "<p>Erreur lors du chargement des voitures.</p>";
      console.log(result);
      return;
    }

    const voitures = result.voitures;

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    function activerBoutons() {
      // Boutons supprimer
      document.querySelectorAll(".SupprimerVoiture").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          supprimerVoiture(id);
        });
      });

      // Boutons consulter
      document.querySelectorAll(".ConsulterVoiture").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          consulterVoiture(id);
        });
      });
    }

    if (voitures.length === 0) {

      mesVoitures.innerHTML = `
        <div class="voiture">
          <img src="/projets/tfe-aout/ajouterVoiture.png" alt="icone pour ajouter une voiture à son garage virtuel" class="logoMarque">
          <h4>Aucune voiture enregistrée</h4>
          <p class="legend">Cliquez ci-dessous pour en ajouter une !</p>
          <button type="button" id="ajouterVoiture">Ajouter un véhicule</button>
        </div>
      `;

    } else {

      mesVoitures.innerHTML = voitures
        .map(v => `
          <div class="voiture">
            <img src="/projets/tfe-aout/optimized/${v.marque}.webp" alt="logo marque" class="logoMarque">

            <h4 class="marque">${capitalize(v.marque)} ${capitalize(v.modele)}</h4>
            <p class="legend NomMarque">${v.anneeConstruction} | ${v.kmParcourues}km</p>

            <div class="boutonsVoiture">
              <button type="button" class="SupprimerVoiture fullWidth" data-id="${v.id}">Supprimer</button>
              <button type="button" class="ConsulterVoiture fullWidth" data-id="${v.id}">Consulter</button>
            </div>
          </div>
        `)
        .join("") +
        `
          <div class="voiture">
            <img src="/projets/tfe-aout/ajouterVoiture.png" alt="icone pour ajouter une voiture à son garage virtuel" class="logoMarque">
            <h4>Garage incomplet ?</h4>
            <p class="legend">Cliquez ci-dessous pour le compléter !</p>
            <button type="button" id="ajouterVoiture">Ajouter un véhicule</button>
          </div>
        `;
    }

    // Activer les boutons supprimer/consulter (si voitures > 0)
    activerBoutons();

    // Activer le bouton ajouter (toujours)
    const ajouterVoitureBtn = document.getElementById("ajouterVoiture");
    if (ajouterVoitureBtn) {
      ajouterVoitureBtn.addEventListener("click", () => {
        window.location.href = "ajouterVoiture.html";
      });
    }
  }

  async function supprimerVoiture(id) {
    const confirmation = confirm("Voulez-vous vraiment supprimer cette voiture ?");

    if (!confirmation) {
      return;
    }

    await fetch(`/projets/tfe-aout/api/voitures.php?id=${id}`, {
        method: "DELETE"
    });

    const userId = localStorage.getItem("userId");
    chargerVoitures(userId);
  }

  function consulterVoiture(id) {
    window.location.href = `/projets/tfe-aout/problemes.html?voitureId=${id}`;
  }

  // Charger automatiquement à l’ouverture de la page
  document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      mesVoitures.innerHTML = "<p>Erreur : utilisateur non connecté.</p>";
      return;
    }

    chargerVoitures(userId);
  });
}

if (fichier === "ajouterVoiture.html") {
  /* Ajouter voiture */
  document.getElementById("formAjouterVoiture").addEventListener("submit", async function (e) {
    e.preventDefault();

    const marque = document.getElementById("marque").value.trim().toLowerCase();
    const modele = document.getElementById("modele").value.trim();
    const type = document.getElementById("type").value;
    const kms = document.getElementById("kms").value;
    const mois = document.getElementById("mois").value;
    const annee = document.getElementById("annee").value;

    const userId = localStorage.getItem("userId");

    const data = {
      userId,
      marque,
      modele,
      type,
      kmParcourues: kms,
      moisConstruction: mois,
      anneeConstruction: annee
    };

    const response = await fetch("/projets/tfe-aout/api/voitures.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = "mesVoitures.html";
    } else {
      console.log(result);
      alert("Erreur lors de l'ajout de la voiture.");
    }
  });
}

if (fichier === "problemes.html") {

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  async function chargerVoiture(voitureId) {
    const response = await fetch(`/projets/tfe-aout/api/voitures.php?voitureId=${voitureId}`);
    const result = await response.json();

    if (!result.success) {
      console.log("Erreur API :", result);
      return;
    }

    const v = result.voiture;

    const titre = document.getElementById("titreVoiture");
    titre.textContent = `${capitalize(v.marque)} ${capitalize(v.modele)}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const voitureId = params.get("voitureId");

    if (voitureId) {
      chargerVoiture(voitureId);
    }
  });
}
