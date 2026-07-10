"use strict";

const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const response = await fetch('/api/login.php', {
    method: 'POST',
    body: data
  });

  const json = await response.json();
  alert(json.message);

  if (json.message === "Connexion réussie") {
    window.location.href = "/dashboard.html";
  }
});
