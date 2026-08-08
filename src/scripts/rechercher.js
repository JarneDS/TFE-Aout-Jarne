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
          <a href="${page.url}" class="recherche__lien"><span class="h3">${page.content}</span><span><strong>Page&nbsp;${page.title}&nbsp;→</strong></span></a>
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
];