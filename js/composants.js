/**
 * composants.js — Morceaux de HTML réutilisés sur plusieurs pages.
 */

import { formaterPrix, echapperHtml } from "./utils.js";

/**
 * Génère le HTML d'une carte produit (accueil et catalogue).
 * @param {Object} produit - produit venant de la base
 * @returns {string} HTML de la carte
 */
export function genererCarteProduit(produit) {
  const nom = echapperHtml(produit.nom);

  return `
    <article class="carte-produit">
      <a href="produit.html?id=${produit.id}" class="carte-lien">
        <img src="${echapperHtml(produit.image_url)}" alt="${nom}" class="carte-image" loading="lazy" />
        <div class="carte-corps">
          <span class="carte-badge">${echapperHtml(produit.categorie)}</span>
          <h3 class="carte-titre">${nom}</h3>
          <p class="carte-prix">${formaterPrix(produit.prix)}</p>
        </div>
      </a>
    </article>
  `;
}

/**
 * Génère un message d'information (liste vide, erreur...).
 * @param {string} texte - message à afficher
 * @returns {string} HTML du message
 */
export function genererMessage(texte) {
  return `<p class="message-vide">${echapperHtml(texte)}</p>`;
}

/**
 * Génère le message affiché pendant un chargement.
 * @returns {string} HTML du message
 */
export function genererChargement() {
  return genererMessage("Chargement…");
}