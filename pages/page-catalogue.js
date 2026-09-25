/**
 * page-catalogue.js — Catalogue avec filtre par catégorie, recherche et tri par prix.
 * Les produits sont chargés une seule fois, puis filtrés en mémoire.
 */

import { recupererProduits } from "../js/api.js";
import { genererCarteProduit, genererChargement, genererMessage } from "../js/composants.js";

const COMPARATEURS_PRIX = {
  croissant: (a, b) => a.prix - b.prix,
  decroissant: (a, b) => b.prix - a.prix,
};

/**
 * Lit les critères choisis par l'utilisateur.
 * @param {Object} champs - éléments du formulaire de filtre
 * @returns {{ categorie: string, terme: string, tri: string }}
 */
function lireCriteres({ categorie, recherche, tri }) {
  return {
    categorie: categorie.value,
    terme: recherche.value.toLowerCase().trim(),
    tri: tri.value,
  };
}

/**
 * Filtre puis trie les produits selon les critères.
 * @param {Array} produits - tous les produits
 * @param {Object} criteres - résultat de lireCriteres
 * @returns {Array} produits à afficher
 */
function filtrerEtTrier(produits, { categorie, terme, tri }) {
  const resultats = produits.filter(
    (produit) =>
      (categorie === "Tous" || produit.categorie === categorie) &&
      produit.nom.toLowerCase().includes(terme)
  );

  const comparateur = COMPARATEURS_PRIX[tri];
  // [...resultats] crée une copie : sort() ne modifie pas le tableau d'origine
  return comparateur ? [...resultats].sort(comparateur) : resultats;
}

/**
 * Affiche les produits dans la grille, ou un message si la liste est vide.
 */
function afficherResultats(grille, produits) {
  grille.innerHTML =
    produits.length === 0
      ? genererMessage("Aucun produit trouvé.")
      : produits.map(genererCarteProduit).join("");
}

/**
 * Charge les produits et branche les filtres.
 * @param {HTMLElement} grille - conteneur #grille-catalogue
 */
export async function initialiserCatalogue(grille) {
  const champs = {
    categorie: document.getElementById("filtre-categorie"),
    recherche: document.getElementById("recherche"),
    tri: document.getElementById("tri-prix"),
  };

  grille.innerHTML = genererChargement();
  const produits = await recupererProduits();

  const actualiser = () =>
    afficherResultats(grille, filtrerEtTrier(produits, lireCriteres(champs)));

  champs.categorie.addEventListener("change", actualiser);
  champs.recherche.addEventListener("input", actualiser);
  champs.tri.addEventListener("change", actualiser);

  actualiser();
}