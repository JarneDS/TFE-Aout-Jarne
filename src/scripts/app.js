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
        titleProfil.textContent = `${user.nom} ${user.prenom}`;
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
