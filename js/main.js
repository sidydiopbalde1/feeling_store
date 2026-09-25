/**
 * main.js — Point d'entrée du site.
 * Met en place le header et le footer, puis lance le code propre à la page courante.
 */

import { afficherMiseEnPage } from "./layout.js";
import { mettreAJourBadgePanier } from "./panier.js";
import { genererMessage } from "./composants.js";
import { initialiserAccueil } from "../pages/page-accueil.js";
import { initialiserCatalogue } from "../pages/page-catalogue.js";
import { initialiserFicheProduit } from "../pages/page-produit.js";
import { initialiserPagePanier } from "../pages/page-panier.js";

// Chaque page est reconnue grâce à un élément qui n'existe que sur elle
const PAGES = [
  { selecteur: "#produits-accueil", initialiser: initialiserAccueil },
  { selecteur: "#grille-catalogue", initialiser: initialiserCatalogue },
  { selecteur: "#fiche-produit", initialiser: initialiserFicheProduit },
  { selecteur: "#contenu-panier", initialiser: initialiserPagePanier },
];

async function initialiserPage() {
  afficherMiseEnPage();
  mettreAJourBadgePanier();

  for (const { selecteur, initialiser } of PAGES) {
    const conteneur = document.querySelector(selecteur);
    if (!conteneur) continue;

    try {
      await initialiser(conteneur);
    } catch (erreur) {
      console.error(erreur);
      conteneur.innerHTML = genererMessage(
        "Impossible de charger les produits. Vérifiez votre connexion puis réessayez."
      );
    }
  }
}

// Un script de type module s'exécute une fois le HTML chargé : pas besoin de DOMContentLoaded
initialiserPage();