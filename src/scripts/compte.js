"use strict";

/* LOGIN */
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


/* CREER COMPTE */
const imgInput = document.getElementById('image');
const previewImage = document.getElementById('previewImage');
const nomInput = document.getElementById('nom');
const prenomInput = document.getElementById('prenom');
const userName = document.getElementById('userName');
const form2 = document.getElementById('creerCompteForm');

if (imgInput) {
  imgInput.addEventListener('change', () => {
    const file = imgInput.files[0];
    if (file) {
      previewImage.src = URL.createObjectURL(file);
    }
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
