"use strict";

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
        localStorage.setItem("userId", json.userId);
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
