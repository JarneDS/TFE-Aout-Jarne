"use strict";

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
          <a href="${page.url}" class="recherche__lien"><span class="h3">${page.content}</span><span><strong>Page ${page.title} →</strong></span></a>
        </div
      `;
      rechercheResults.appendChild(li);
    });
  } else {
    rechercheResults.innerHTML = '<li>Aucun résultat trouvé</li>';
  }
});

// Contenu de mes 12 pages
const rechercheIndex = [
  {
    title: "Accueil",
    url: "accueil.html",
    content: "Bienvenue, sélectionnez le type de véhicule pour en apprendre plus sur celui-ci"
  },
];