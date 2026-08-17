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
  fetch('/projets/tfe-aout/api/getUser.php')
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

  fetch('/projets/tfe-aout/api/getUser.php')
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
      mesVoitures.innerHTML = "<p>Utilisateur non connecté.</p>";
      return;
    }

    const voitures = result.voitures;

    // FILTRE DES MARQUES
    const btnFiltre = document.getElementById("btnFiltreVoitures");
    const selectFiltre = document.getElementById("selectFiltreVoitures");

    // Remplir le select avec les marques uniques
    btnFiltre.addEventListener("click", () => {
      selectFiltre.style.display = "block";

      const marques = [...new Set(voitures.map(v => v.marque))];

      selectFiltre.innerHTML = `<option value="">Toutes les marques</option>`;

      marques.forEach(marque => {
        const opt = document.createElement("option");
        opt.value = marque;
        opt.textContent = capitalize(marque);
        selectFiltre.appendChild(opt);
      });
    });

    // Filtrer l'affichage
    selectFiltre.addEventListener("change", () => {
      const marqueChoisie = selectFiltre.value;

      let voituresFiltrees = voitures;

      if (marqueChoisie !== "") {
        voituresFiltrees = voitures.filter(v => v.marque === marqueChoisie);
      }

      afficherVoituresFiltrees(voituresFiltrees);
    });

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

    function activerBoutonAjouter() {
      const ajouterVoitureBtn = document.getElementById("ajouterVoiture");
      if (ajouterVoitureBtn) {
        ajouterVoitureBtn.addEventListener("click", () => {
          window.location.href = "ajouterVoiture.html";
        });
      }
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

    function afficherVoituresFiltrees(listeVoitures) {

      mesVoitures.innerHTML = listeVoitures
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

      activerBoutons();
      activerBoutonAjouter();
    }


    // Activer les boutons supprimer/consulter (si voitures > 0)
    activerBoutons();

    // Activer le bouton ajouter (toujours)
    activerBoutonAjouter();
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

if (fichier === "problemes.html") {
  const voitureId = new URLSearchParams(window.location.search).get("voitureId");
  chargerProblemes(voitureId);

  const btnFiltreProblemes = document.getElementById("btnFiltreProblemes");
  const selectFiltreProblemes = document.getElementById("selectFiltreProblemes");

  const btnModifier = document.querySelector(".headerProblemes__btn");

  btnModifier.addEventListener("click", () => {
    const voitureId = new URLSearchParams(window.location.search).get("voitureId");
    window.location.href = `modifierVoiture.html?voitureId=${voitureId}`;
  });

  document.getElementById("formProblemes").addEventListener("submit", async (e) => {
    e.preventDefault();

    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value;
    const survenance = document.getElementById("survenance").value;

    const res = await fetch("/projets/tfe-aout/api/problemes.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voitureId: voitureId,
        type_probleme: type,
        description: description,
        date_survenance: survenance
      })
    });

    const data = await res.json();

    if (data.success) {
      chargerProblemes(voitureId);
      e.target.reset();
    }
  });

  function activerInteractions() {
    document.querySelectorAll(".selectEtat").forEach(select => {
      select.addEventListener("change", async () => {
        const container = select.closest(".probleme__Container");
        const id = container.dataset.id;

        await fetch("/projets/tfe-aout/api/problemes.php?update=1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            statut: select.value === "enCours" ? "En cours" : "Réparé"
          })
        });
      });
    });

    document.querySelectorAll(".btnSupprimer").forEach(btn => {
      btn.addEventListener("click", async () => {
        const container = btn.closest(".probleme__Container");
        const id = container.dataset.id;

        await fetch(`/projets/tfe-aout/api/problemes.php?id=${id}`, {
          method: "DELETE"
        });

        container.remove();
      });
    });
  }

  let problemesGlobal = [];

  async function chargerProblemes(voitureId) {
    const res = await fetch(`/projets/tfe-aout/api/problemes.php?voitureId=${voitureId}`);
    const problemes = await res.json();

    problemesGlobal = problemes;

    const container = document.getElementById("listeProblemes");

    if (problemes.length === 0) {
      container.innerHTML = "<p>Aucun problème enregistré.</p>";
      return;
    }

    container.innerHTML = problemes.map(p => `
      <div class="probleme__Container" data-id="${p.id}">
        <div class="problemeDescription__container">
          <h3 class="probleme__title">${p.type_probleme}</h3>
          <p class="probleme__description">${p.description}</p>
          <div class="dateProbleme__container">
            <img src="/projets/tfe-aout/calendar.svg" alt="icone d'un calendrier" class="calendarIcone">
            <p class="legend">${p.date_survenance}</p>
          </div>
        </div>

        <div class="problemeEtat__container">
          <select name="problemeEtat" class="selectEtat">
            <option value="enCours" ${p.statut === "En cours" ? "selected" : ""}>En cours</option>
            <option value="repare" ${p.statut === "Réparé" ? "selected" : ""}>Réparé</option>
          </select>

          <img src="/projets/tfe-aout/corbeille.png" alt="icone d'une poubelle" class="btnSupprimer">
        </div>
      </div>
    `).join("");

    activerInteractions();
    document.querySelectorAll(".selectEtat").forEach(select => {
      if (select.value === "enCours") {
        select.style.backgroundColor = "#FF0000";
        select.style.color = "#FFF";
      } else {
        select.style.backgroundColor = "#00FF00";
        select.style.color = "#000";
      }

      select.addEventListener("change", () => {
        if (select.value === "enCours") {
          select.style.backgroundColor = "#FF0000";
          select.style.color = "#FFF";
        } else {
          select.style.backgroundColor = "#00FF00";
          select.style.color = "#000";
        }
      });
    });
  }

  function afficherProblemesFiltres(liste) {
    const container = document.getElementById("listeProblemes");

    if (liste.length === 0) {
      container.innerHTML = "<p>Aucun problème trouvé pour ce type.</p>";
      return;
    }

    container.innerHTML = liste.map(p => `
      <div class="probleme__Container" data-id="${p.id}">
        <div class="problemeDescription__container">
          <h3 class="probleme__title">${p.type_probleme}</h3>
          <p class="probleme__description">${p.description}</p>
          <div class="dateProbleme__container">
            <img src="/projets/tfe-aout/calendar.svg" alt="icone d'un calendrier" class="calendarIcone">
            <p class="legend">${p.date_survenance}</p>
          </div>
        </div>

        <div class="problemeEtat__container">
          <select name="problemeEtat" class="selectEtat">
            <option value="enCours" ${p.statut === "En cours" ? "selected" : ""}>En cours</option>
            <option value="repare" ${p.statut === "Réparé" ? "selected" : ""}>Réparé</option>
          </select>

          <img src="/projets/tfe-aout/corbeille.png" alt="icone d'une poubelle" class="btnSupprimer">
        </div>
      </div>
    `).join("");

    activerInteractions();

    // couleurs des selects
    document.querySelectorAll(".selectEtat").forEach(select => {
      if (select.value === "enCours") {
        select.style.backgroundColor = "#FF0000";
        select.style.color = "#FFF";
      } else {
        select.style.backgroundColor = "#00FF00";
        select.style.color = "#000";
      }

      select.addEventListener("change", () => {
        if (select.value === "enCours") {
          select.style.backgroundColor = "#FF0000";
          select.style.color = "#FFF";
        } else {
          select.style.backgroundColor = "#00FF00";
          select.style.color = "#000";
        }
      });
    });
  }

  btnFiltreProblemes.addEventListener("click", () => {
    selectFiltreProblemes.style.display = "block";

    const types = [...new Set(problemesGlobal.map(p => p.type_probleme))];

    selectFiltreProblemes.innerHTML = `<option value="">Tous les types</option>`;

    types.forEach(type => {
      const opt = document.createElement("option");
      opt.value = type;
      opt.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      selectFiltreProblemes.appendChild(opt);
    });
  });

  selectFiltreProblemes.addEventListener("change", () => {
    const typeChoisi = selectFiltreProblemes.value;

    let listeFiltre = problemesGlobal;

    if (typeChoisi !== "") {
      listeFiltre = problemesGlobal.filter(p => p.type_probleme === typeChoisi);
    }

    afficherProblemesFiltres(listeFiltre);
  });

  document.querySelector(".SupprimerVoiture").addEventListener("click", supprimerVoiture);

  async function supprimerVoiture() {
    const voitureId = new URLSearchParams(window.location.search).get("voitureId");

    if (!confirm("Voulez-vous vraiment supprimer ce véhicule ?")) return;

    const res = await fetch(`/projets/tfe-aout/api/voitures.php?id=${voitureId}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "mesVoitures.html";
    } else {
      alert("Erreur lors de la suppression.");
    }
  }
}

if (fichier === "modifierVoiture.html") {

  const voitureId = new URLSearchParams(window.location.search).get("voitureId");

  chargerInfosVoiture(voitureId);

  async function chargerInfosVoiture(id) {
    const res = await fetch(`/projets/tfe-aout/api/voitures.php?voitureId=${id}`);
    const data = await res.json();
    const v = data.voiture;

    // Remplir le formulaire
    document.getElementById("marque").value = v.marque;
    document.getElementById("modele").value = v.modele;
    document.getElementById("type").value = v.type;
    document.getElementById("kms").value = v.kmParcourues;
    document.getElementById("mois").value = v.moisConstruction;
    document.getElementById("annee").value = v.anneeConstruction;

    document.getElementById("titreVoiture").textContent = `Changer les informations de votre ${v.marque} ${v.modele} :`;
  }

  document.getElementById("formModifierVoiture").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      id: voitureId,
      marque: document.getElementById("marque").value.trim(),
      modele: document.getElementById("modele").value.trim(),
      type: document.getElementById("type").value,
      kmParcourues: document.getElementById("kms").value,
      moisConstruction: document.getElementById("mois").value,
      anneeConstruction: document.getElementById("annee").value
    };

    const res = await fetch("/projets/tfe-aout/api/voitures.php?update=1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      alert("Voiture modifiée avec succès !");
      window.location.href = "mesVoitures.html";
    } else {
      alert("Erreur lors de la modification.");
    }
  });
}

fetch("/projets/tfe-aout/api/getUser.php")
  .then(res => res.json())
  .then(data => {
    if (data.logged) {
      const user = data.user;

      if (fichier.includes("accueil")) {
        const bienvenue = document.getElementById("bienvenue");
        bienvenue.textContent = `Bienvenue ${user.nom} ${user.prenom},`;
      }
    }
  });

if (fichier === "moteur.html" || fichier === "freins.html" || fichier === "temoins.html" || fichier === "peinture.html" || fichier === "chassis.html" || fichier === "roues.html" || fichier === "suspension.html") {
  const boutonsMoteur = document.querySelectorAll(
    ".boutonMoteurA, .boutonMoteurB, .boutonMoteurC, .boutonMoteurD, .boutonMoteurE, .boutonMoteurF, .boutonMoteurG"
  );

  const boutonsFrein = document.querySelectorAll(
    ".boutonFreinA, .boutonFreinB, .boutonFreinC"
  );

  const boutonsTemoin = document.querySelectorAll(
    ".boutonTemoinA, .boutonTemoinB, .boutonTemoinC"
  );

  const boutonsPeinture = document.querySelectorAll(
    ".boutonPeintureA, .boutonPeintureB"
  );

  const boutonsChassis = document.querySelectorAll(
    ".boutonChassisA, .boutonChassisB"
  );

  const boutonsRoues = document.querySelectorAll(
    ".boutonRouesA, .boutonRouesB, .boutonRouesC"
  );

  const boutonsSuspension = document.querySelectorAll(
    ".boutonSuspensionA, .boutonSuspensionB"
  );

  boutonsMoteur.forEach(btn => {
    btn.addEventListener("click", () => {
      afficherPartie(btn.dataset.value);
    });
  });

  boutonsFrein.forEach(btn => {
    btn.addEventListener("click", () => {
      afficherPartie(btn.dataset.value);
    });
  });

  boutonsTemoin.forEach(btn => {
    btn.addEventListener("click", () => {
      afficherPartie(btn.dataset.value);
    });
  });

  boutonsPeinture.forEach(btn => {
    btn.addEventListener("click", () => {
      afficherPartie(btn.dataset.value);
    });
  });

  boutonsChassis.forEach(btn => {
    btn.addEventListener("click", () => {
      afficherPartie(btn.dataset.value);
    });
  });

  boutonsRoues.forEach(btn => {
    btn.addEventListener("click", () => {
      afficherPartie(btn.dataset.value);
    });
  });

  boutonsSuspension.forEach(btn => {
    btn.addEventListener("click", () => {
      afficherPartie(btn.dataset.value);
    });
  });

  function afficherPartie(id) {
    const sections = document.querySelectorAll('.part');
    const intro = document.getElementById('Intro');
    const cible = document.getElementById(id);

    sections.forEach(section => section.classList.remove("active"));

    if (cible) {
      cible.classList.add("active");
    }

    document.querySelector(".infos").style.display = "block";

    intro.classList.add("no-scroll");
  }

  document.querySelectorAll(".fermerPart").forEach(btn => {
    btn.addEventListener("click", () => {
      const part = btn.closest(".part");
      const intro = document.getElementById('Intro');

      if (part) {
        part.classList.remove("active");
      }

      document.querySelector(".infos").style.display = "none";

      intro.classList.remove("no-scroll");
    });
  });
}

if (fichier === "entretien.html" || fichier === "diagnostiques.html") {

  const sectionEntretien = document.querySelector('.Entretien');
  const sectionPart = document.querySelector('.Entretienpart__container');
  const btnRetourEntretien = document.querySelector('.btnEntretien');

  // fonction afficherPart
  function afficherPart(value) {

    sectionEntretien.style.display = "none";
    sectionPart.style.display = "block";

    document.querySelectorAll('.Entretienpart').forEach(p => {
      p.classList.remove('active');
    });

    const target = document.getElementById(value);
    if (target) {
      target.classList.add('active');

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // 1. Clic sur une carte
  document.querySelectorAll('.Entretien__cart').forEach(cart => {
    cart.addEventListener('click', () => {
      afficherPart(cart.dataset.value);
    });
  });

  document.querySelectorAll('.Diagno__cart').forEach(cart => {
    cart.addEventListener('click', () => {
      afficherPart(cart.dataset.value);
    });
  });

  // 2. Clic sur le bouton Retour (btnEntretien)
  if (btnRetourEntretien) {
    btnRetourEntretien.addEventListener('click', () => {
      sectionPart.style.display = "none";
      sectionEntretien.style.display = "block";

      document.querySelectorAll('.Entretienpart').forEach(p => {
        p.classList.remove('active');
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Récupère le paramètre "part" dans l'URL
  const params = new URLSearchParams(window.location.search);
  const partToShow = params.get("part");

  if (partToShow) {

    // Masquer la section principale
    sectionEntretien.style.display = "none";

    // Afficher le container des parties
    sectionPart.style.display = "block";

    // Retirer toutes les classes active
    document.querySelectorAll('.Entretienpart').forEach(part => {
      part.classList.remove('active');
    });

    // Activer uniquement la partie demandée
    const target = document.getElementById(partToShow);
    if (target) {
      target.classList.add('active');

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
};

if (fichier === "index.html") {
  const form = document.getElementById('loginForm');
  const btnCreer = document.querySelector('.button__creer');
  const btnGuest = document.querySelector('.button__sansCompte');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);

      fetch('/projets/tfe-aout/api/login.php', {
        method: 'POST',
        body: data
      })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        if (json.message === 'Connexion réussie') {
          window.location.href = 'mesVoitures.html';
        }
      });
    });
  }

  if (btnCreer) {
    btnCreer.addEventListener('click', () => {
      window.location.href = 'creerCompte.html';
    });
  }

  if (btnGuest) {
    btnGuest.addEventListener('click', () => {
      window.location.href = 'accueil.html';
    });
  }
};

if (fichier === "creerCompte.html") {
  const imgInput = document.getElementById('image');
  const previewImage = document.getElementById('previewImage');
  const nomInput = document.getElementById('nom');
  const prenomInput = document.getElementById('prenom');
  const userName = document.getElementById('userName');
  const form2 = document.getElementById('creerCompteForm');
  const container = document.getElementById('imageProfilContainer');
  const crayonImage = document.getElementById('modifierImage');

  if (!imgInput.files.length) {
    previewImage.style.display = "none";
    container.classList.add("no-image");
  }

  if (imgInput) {
    imgInput.addEventListener('change', () => {
      const file = imgInput.files[0];
      if (file) {
        previewImage.src = URL.createObjectURL(file);
        previewImage.style.display = "block";
        container.classList.remove("no-image");
      }
    });
  }

  if (container && imgInput) {
    container.addEventListener('click', () => {
      imgInput.click();
    });
  }

  if (nomInput && prenomInput && userName) {
    function updateName() {
      userName.textContent = `${nomInput.value} ${prenomInput.value}`.trim();
    }

    nomInput.addEventListener('input', updateName);
    prenomInput.addEventListener('input', updateName);
  }

  if (form2) {
    form2.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = new FormData(form2);

      const response = await fetch('/projets/tfe-aout/api/register.php', {
        method: 'POST',
        body: data
      });

      const json = await response.json();
      console.log(json);

      if (json.success) {
        window.location.href = 'mesVoitures.html';
      }
    });
  }
};

if (fichier === "monCompte.html") {
  const imgInput2 = document.getElementById('image');
  const previewImage2 = document.getElementById('previewImage');
  const nomInput2 = document.getElementById('nom');
  const prenomInput2 = document.getElementById('prenom');
  const userName2 = document.getElementById('userName');
  const emailInput = document.getElementById('email');
  const mdpInput = document.getElementById('mdp');
  const formModifier = document.getElementById('modifierCompteForm');
  const container2 = document.getElementById('imageProfilContainer');
  const crayonImage2 = document.getElementById('modifierImage');

  // Charger les infos du compte
  async function loadUserData() {
    const response = await fetch('/projets/tfe-aout/api/getUser.php');
    const data = await response.json();

    if (!data.logged) return;

    const user = data.user;

    nomInput2.value = user.nom;
    prenomInput2.value = user.prenom;
    emailInput.value = user.email;

    userName2.textContent = `${user.nom} ${user.prenom}`;

    if (user.image) {
      previewImage2.src = user.image;
      previewImage2.style.display = "block";
      container2.classList.remove("no-image");
    } else {
      previewImage2.style.display = "none";
      container2.classList.add("no-image");
    }
  }

  loadUserData();

  // Modifier la photo
  imgInput2.addEventListener('change', () => {
    const file = imgInput.files[0];
    if (file) {
      previewImage2.src = URL.createObjectURL(file);
      previewImage2.style.display = "block";
      container2.classList.remove("no-image");
    }
  });

  container2.addEventListener('click', () => imgInput2.click());

  // Modifier nom/prénom affiché
  function updateName() {
    userName2.textContent = `${nomInput2.value} ${prenomInput2.value}`.trim();
  }

  nomInput2.addEventListener('input', updateName);
  prenomInput2.addEventListener('input', updateName);

  // Désactiver le bouton au départ
  const btnEnregistrer = document.getElementById("enregistrer");
  btnEnregistrer.disabled = true;
  btnEnregistrer.style.cursor = "default";
  btnEnregistrer.style.opacity = .5;

  // Stocker les valeurs initiales après chargement
  let initialData = {};

  document.addEventListener("DOMContentLoaded", () => {
    initialData = {
      nom: nomInput2.value,
      prenom: prenomInput2.value,
      email: emailInput.value,
      mdp: "",
      image: null
    };
  });

  // Vérifier si quelque chose a changé
  function checkChanges() {
    const hasChanged =
      nomInput2.value !== initialData.nom ||
      prenomInput2.value !== initialData.prenom ||
      emailInput.value !== initialData.email ||
      mdpInput.value.length > 0 ||
      imgInput2.files.length > 0;

    btnEnregistrer.disabled = !hasChanged;
    btnEnregistrer.style.cursor = "pointer";
    btnEnregistrer.style.opacity = 1;
  }

  // Écouter les changements
  nomInput2.addEventListener("input", checkChanges);
  prenomInput2.addEventListener("input", checkChanges);
  emailInput.addEventListener("input", checkChanges);
  mdpInput.addEventListener("input", checkChanges);
  imgInput2.addEventListener("change", checkChanges);

  // Enregistrer les modifications
  document.getElementById("enregistrer").addEventListener('click', async (e) => {
    e.preventDefault();

    const data = new FormData(formModifier);

    const response = await fetch('/projets/tfe-aout/api/updateUser.php', {
      method: 'POST',
      body: data
    });

    const json = await response.json();

    if (json.success) {
      alert("Compte mis à jour !");
    }
  });


  // Se déconnecter
  document.getElementById("deconnecter").addEventListener("click", async (e) => {
    e.preventDefault();
    await fetch('/projets/tfe-aout/api/logout.php');
    window.location.href = "index.html";
  });

  // Supprimer mon compte
  document.getElementById("supprimerCompte").addEventListener("click", async (e) => {
    e.preventDefault();

    if (!confirm("Supprimer ton compte ?")) return;

    await fetch('/projets/tfe-aout/api/deleteUser.php');
    window.location.href = "index.html";
  });

  // Focus sur l'input quand on clique sur le crayon
  document.querySelectorAll('.changerInfosContainer').forEach(container => {
    const input = container.querySelector('input');
    const button = container.querySelector('.bgCrayon');

    button.addEventListener('click', () => {
      input.focus();
    });
  });
};

if (fichier === "rechercher.html") {
  const rechercheInput = document.getElementById('recherche__input');
  const rechercheResults = document.getElementById('recherche__results');

  rechercheInput.addEventListener('input', function () {
    const query = this.value.toLowerCase().trim();
    rechercheResults.innerHTML = ''; // Vide les anciens résultats

    // Si la recherche fait moins de 2 caractères, on n'affiche rien
    if (query.length < 2) return;

    // Filtration de l'index
    const matches = rechercheIndex.filter(page => {
      return page.title.toLowerCase().includes(query) ||
        page.content.toLowerCase().includes(query);
    });

    // Affichage des résultats
    if (matches.length > 0) {
      matches.forEach(page => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="recherche__result">
            <a href="${page.url}" class="recherche__lien"><span class="h3">${page.content}</span><span class="bold">Page&nbsp;${page.title}&nbsp;→</span></a>
          </div
        `;
        rechercheResults.appendChild(li);
      });
    } else {
      rechercheResults.innerHTML = '<li>Aucun résultat trouvé</li>';
    }
  });

  const rechercheIndex = [
    {
      title: "Accueil",
      url: "accueil.html",
      content: "Bienvenue, sélectionnez le type de véhicule pour en apprendre plus sur celui-ci"
    },
    {
      title: "Moteur",
      url: "moteur.html",
      content: "Le système de refroidissement"
    },
    {
      title: "Moteur",
      url: "moteur.html",
      content: "L'alimentation en air, filtre à air"
    },
    {
      title: "Moteur",
      url: "moteur.html",
      content: "Les liquides : huile moteur, liquide de refroidissement, liquide de frein, liquide de direction assistée, liquide lave-glace."
    },
    {
      title: "Moteur",
      url: "moteur.html",
      content: "Le système électrique :  Batterie, Alternateur, Fusibles"
    },
    {
      title: "Moteur",
      url: "moteur.html",
      content: "La transmission : L'embrayage, boite de vitesses, arbre de transmission, différentiel, cardans"
    },
    {
      title: "Moteur",
      url: "moteur.html",
      content: "Fonctionnement, besoins d'un moteur, types de motricités (Traction, Propulsion, 4x4)"
    },
    {
      title: "Témoins lumineux",
      url: "temoins.html",
      content: "Différents couleurs de témoins lumineux : vert/bleu, orange/ambre, rouge"
    },
    {
      title: "Témoins lumineux",
      url: "temoins.html",
      content: "Les principaux témoins verts / bleus :"
    },
    {
      title: "Témoins lumineux",
      url: "temoins.html",
      content: "Les principaux témoins orange / ambre :"
    },
    {
      title: "Témoins lumineux",
      url: "temoins.html",
      content: "Les principaux témoins rouge :"
    },
    {
      title: "Freins",
      url: "freins.html",
      content: "Introduction, que doit être un système de freinage ?"
    },
    {
      title: "Freins",
      url: "freins.html",
      content: "Fonctionnement"
    },
    {
      title: "Freins",
      url: "freins.html",
      content: "Éléments principaux : Disques de frein, Plaquettes de frein, Étriers, Liquide de frein, Maître-cylindre, ABS, Freins à tambour"
    },
    {
      title: "Freins",
      url: "freins.html",
      content: "Le frein à main : frein à main mécanique, frein à main électrique (bouton P ou AUTO HOLD). Sur quoi agit le frein à main ?"
    },
    {
      title: "Peinture",
      url: "peinture.html",
      content: "Les différentes couches : tôle, anticorrosion, apprêt, bas colorée, vernis"
    },
    {
      title: "Peinture",
      url: "peinture.html",
      content: "Finitions de la peinture : unie, métalisée, nacrée, matte, tricouche"
    },
    {
      title: "Chassis",
      url: "chassis.html",
      content: "Les rôles du chassis"
    },
    {
      title: "Chassis",
      url: "chassis.html",
      content: "Qu'est-ce qui est fixé sur le châssis ?"
    },
    {
      title: "Chassis",
      url: "chassis.html",
      content: "Importance et vérifications"
    },
    {
      title: "Suspension",
      url: "suspension.html",
      content: "Les rôles de la suspension sur une voiture"
    },
    {
      title: "Suspension",
      url: "suspension.html",
      content: "Composants de la suspension : amortisseurs, ressorts, triangles, silentblocs, barre stabilisatrice, rotules"
    },
    {
      title: "Roues",
      url: "roues.html",
      content: "Pourquoi les roues sont importantes ?"
    },
    {
      title: "Roues",
      url: "roues.html",
      content: "Les différents types de pneus"
    },
    {
      title: "Roues",
      url: "roues.html",
      content: "Comment lire un pneu ? Que veulent dire les chiffres sur le flanc du pneu ?"
    },
    {
      title: "Diagnostiques",
      url: "diagnostiques.html",
      content: "Problème avec le lave-glace qui ne fonctionne pas"
    },
    {
      title: "Diagnostiques",
      url: "diagnostiques.html",
      content: "Problème avec la batterie ? Comment savoir si c'est la batterie ?"
    },
    {
      title: "Diagnostiques",
      url: "diagnostiques.html",
      content: "Problème avec un fusible ? Comment savoir si c'est un fusible qui a grillée ?"
    },
    {
      title: "Diagnostiques",
      url: "diagnostiques.html",
      content: "Comment voir si un pneu est usé ?"
    },
    {
      title: "Entretien",
      url: "entretien.html",
      content: "Comment remplir le lave-glace sans se tromper de bouchon ?"
    },
    {
      title: "Entretien",
      url: "entretien.html",
      content: "Comment changer la batterie de sa voiture de manière sécurisée ?"
    },
    {
      title: "Entretien",
      url: "entretien.html",
      content: "Comment vérifier l'état de ces pneus et quand sont-ils HS ?"
    },
    {
      title: "Entretien",
      url: "entretien.html",
      content: "Comment changer un fusible de sa voiture de manière sécurisée ?"
    },
    {
      title: "Entretien",
      url: "entretien.html",
      content: "Comment lavez sa voiture de manière professionnelle ?"
    },
  ];
};