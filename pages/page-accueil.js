/**
 * page-accueil.js — Produits mis en avant sur la page d'accueil.
 */

import { recupererProduits } from "../js/api.js";
import { genererCarteProduit, genererChargement } from "../js/composants.js";
import { NOMBRE_PRODUITS_ACCUEIL } from "../js/config.js";

/**
 * Affiche les premiers produits dans la section d'accueil.
 * @param {HTMLElement} section - conteneur #produits-accueil
 */
export async function initialiserAccueil(section) {
  section.innerHTML = genererChargement();

  const produits = await recupererProduits();
  section.innerHTML = produits
    .slice(0, NOMBRE_PRODUITS_ACCUEIL)
    .map(genererCarteProduit)
    .join("");
}