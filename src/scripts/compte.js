"use strict";

/* Mon Compte */
const imgInput = document.getElementById('image');
const previewImage = document.getElementById('previewImage');
const nomInput = document.getElementById('nom');
const prenomInput = document.getElementById('prenom');
const userName = document.getElementById('userName');
const emailInput = document.getElementById('email');
const mdpInput = document.getElementById('mdp');
const formModifier = document.getElementById('modifierCompteForm');
const container = document.getElementById('imageProfilContainer');
const crayonImage = document.getElementById('modifierImage');

// Charger les infos du compte
async function loadUserData() {
  const response = await fetch('/projets/tfe-aout/api/getUser.php');
  const data = await response.json();

  if (!data.success) return;

  const user = data.user;

  nomInput.value = user.nom;
  prenomInput.value = user.prenom;
  emailInput.value = user.email;

  userName.textContent = `${user.nom} ${user.prenom}`;

  if (user.image) {
    previewImage.src = user.image;
    previewImage.style.display = "block";
    container.classList.remove("no-image");
  } else {
    previewImage.style.display = "none";
    container.classList.add("no-image");
  }
}

loadUserData();

// Modifier la photo
imgInput.addEventListener('change', () => {
  const file = imgInput.files[0];
  if (file) {
    previewImage.src = URL.createObjectURL(file);
    previewImage.style.display = "block";
    container.classList.remove("no-image");
  }
});

container.addEventListener('click', () => imgInput.click());

// Modifier nom/prénom affiché
function updateName() {
  userName.textContent = `${nomInput.value} ${prenomInput.value}`.trim();
}

nomInput.addEventListener('input', updateName);
prenomInput.addEventListener('input', updateName);

// Désactiver le bouton au départ
const btnEnregistrer = document.getElementById("enregistrer");
btnEnregistrer.disabled = true;
btnEnregistrer.style.cursor = "default";
btnEnregistrer.style.opacity = .5;

// Stocker les valeurs initiales après chargement
let initialData = {};

document.addEventListener("DOMContentLoaded", () => {
  initialData = {
    nom: nomInput.value,
    prenom: prenomInput.value,
    email: emailInput.value,
    mdp: "",
    image: null
  };
});

// Vérifier si quelque chose a changé
function checkChanges() {
  const hasChanged =
    nomInput.value !== initialData.nom ||
    prenomInput.value !== initialData.prenom ||
    emailInput.value !== initialData.email ||
    mdpInput.value.length > 0 ||
    imgInput.files.length > 0;

  btnEnregistrer.disabled = !hasChanged;
  btnEnregistrer.style.cursor = "pointer";
  btnEnregistrer.style.opacity = 1;
}

// Écouter les changements
nomInput.addEventListener("input", checkChanges);
prenomInput.addEventListener("input", checkChanges);
emailInput.addEventListener("input", checkChanges);
mdpInput.addEventListener("input", checkChanges);
imgInput.addEventListener("change", checkChanges);

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
