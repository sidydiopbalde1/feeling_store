/**
 * page-produit.js — Fiche d'un produit, identifié par l'id dans l'URL (produit.html?id=3).
 */

import { recupererProduitParId } from "../js/api.js";
import { ajouterAuPanier } from "../js/panier.js";
import { genererChargement } from "../js/composants.js";
import { TAILLE_UNIQUE, DUREE_CONFIRMATION_MS } from "../js/config.js";
import { formaterPrix, echapperHtml } from "../js/utils.js";

let minuteurConfirmation;

/**
 * Lit l'id du produit dans l'URL.
 * @returns {number|null} id valide, ou null
 */
function lireIdDepuisUrl() {
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * Charge le produit, ou renvoie null s'il n'existe pas.
 */
async function chargerProduit(id) {
  try {
    return await recupererProduitParId(id);
  } catch (erreur) {
    console.error(erreur);
    return null;
  }
}

/**
 * Les accessoires n'ont pas de taille : on propose alors une taille unique.
 * @returns {Array<string>} tailles disponibles
 */
function obtenirTailles(produit) {
  return produit.tailles?.length ? produit.tailles : [TAILLE_UNIQUE];
}

function genererBoutonsTailles(tailles) {
  return tailles
    .map((taille, index) => {
      const classe = index === 0 ? "bouton-taille taille-selectionnee" : "bouton-taille";
      const valeur = echapperHtml(taille);
      return `<button type="button" class="${classe}" data-taille="${valeur}">${valeur}</button>`;
    })
    .join("");
}

function genererFiche(produit, tailles) {
  const nom = echapperHtml(produit.nom);

  return `
    <div class="fiche-contenu">
      <img src="${echapperHtml(produit.image_url)}" alt="${nom}" class="fiche-image" />
      <div class="fiche-details">
        <span class="carte-badge">${echapperHtml(produit.categorie)}</span>
        <h1 class="fiche-titre">${nom}</h1>
        <p class="fiche-prix">${formaterPrix(produit.prix)}</p>
        <p class="fiche-description">${echapperHtml(produit.description)}</p>
        <div class="fiche-tailles">
          <p class="fiche-label">Choisir la taille :</p>
          <div class="tailles-liste" id="tailles-liste">${genererBoutonsTailles(tailles)}</div>
        </div>
        <button type="button" class="bouton bouton-primaire" id="bouton-ajouter">
          Ajouter au panier
        </button>
        <p id="confirmation-ajout" class="confirmation-ajout"></p>
        <a href="catalogue.html" class="lien-retour">← Retour au catalogue</a>
      </div>
    </div>
  `;
}

function afficherProduitIntrouvable(conteneur) {
  conteneur.innerHTML = `
    <p class="message-vide">Produit introuvable.</p>
    <a href="catalogue.html" class="bouton bouton-primaire">Retour au catalogue</a>
  `;
}

/**
 * Affiche un message de confirmation pendant quelques secondes.
 */
function afficherConfirmation(element, texte) {
  element.textContent = texte;
  element.style.display = "block";

  // Annule le minuteur précédent si l'utilisateur clique plusieurs fois
  clearTimeout(minuteurConfirmation);
  minuteurConfirmation = setTimeout(() => {
    element.style.display = "none";
  }, DUREE_CONFIRMATION_MS);
}

/**
 * Branche le choix de la taille et le bouton d'ajout au panier.
 */
function activerInteractions(conteneur, produit, tailles) {
  let tailleSelectionnee = tailles[0];
  const listeTailles = conteneur.querySelector("#tailles-liste");

  listeTailles.addEventListener("click", (evenement) => {
    const bouton = evenement.target.closest(".bouton-taille");
    if (!bouton) return;

    listeTailles.querySelector(".taille-selectionnee")?.classList.remove("taille-selectionnee");
    bouton.classList.add("taille-selectionnee");
    tailleSelectionnee = bouton.dataset.taille;
  });

  conteneur.querySelector("#bouton-ajouter").addEventListener("click", () => {
    ajouterAuPanier(produit.id, tailleSelectionnee, 1);
    afficherConfirmation(
      conteneur.querySelector("#confirmation-ajout"),
      `✓ ${produit.nom} (taille ${tailleSelectionnee}) ajouté au panier !`
    );
  });
}

/**
 * Charge et affiche la fiche du produit demandé.
 * @param {HTMLElement} conteneur - conteneur #fiche-produit
 */
export async function initialiserFicheProduit(conteneur) {
  const id = lireIdDepuisUrl();
  if (id === null) {
    afficherProduitIntrouvable(conteneur);
    return;
  }

  conteneur.innerHTML = genererChargement();
  const produit = await chargerProduit(id);
  if (!produit) {
    afficherProduitIntrouvable(conteneur);
    return;
  }

  document.title = `${produit.nom} - Feeling Store`;
  const tailles = obtenirTailles(produit);
  conteneur.innerHTML = genererFiche(produit, tailles);
  activerInteractions(conteneur, produit, tailles);
}