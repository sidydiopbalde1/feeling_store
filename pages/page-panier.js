/**
 * page-panier.js — Affichage du panier, modification des quantités et commande WhatsApp.
 */

import { recupererProduits, enregistrerCommande } from "../js/api.js";
import {
  obtenirLignesPanier,
  calculerTotalPanier,
  construireMessageWhatsApp,
  modifierQuantite,
  supprimerDuPanier,
  viderPanier,
} from "../js/panier.js";
import { genererChargement } from "../js/composants.js";
import { NUMERO_WHATSAPP } from "../js/config.js";
import { formaterPrix, echapperHtml } from "../js/utils.js";

// Chaque bouton porte un data-action qui correspond à une entrée de ce tableau
const ACTIONS = {
  diminuer: ({ id, taille, quantite }) => modifierQuantite(id, taille, quantite - 1),
  augmenter: ({ id, taille, quantite }) => modifierQuantite(id, taille, quantite + 1),
  supprimer: ({ id, taille }) => supprimerDuPanier(id, taille),
  vider: () => viderPanier(),
};

function genererLignePanier({ produit, taille, quantite, sousTotal }) {
  const nom = echapperHtml(produit.nom);
  const tailleAffichee = echapperHtml(taille);

  return `
    <article class="ligne-panier" data-id="${produit.id}" data-taille="${tailleAffichee}" data-quantite="${quantite}">
      <img src="${echapperHtml(produit.image_url)}" alt="${nom}" class="ligne-image" />
      <div class="ligne-infos">
        <h3 class="ligne-nom">${nom}</h3>
        <p class="ligne-taille">Taille : ${tailleAffichee}</p>
        <p class="ligne-prix-unitaire">${formaterPrix(produit.prix)} / unité</p>
      </div>
      <div class="ligne-quantite">
        <button type="button" class="bouton-qte" data-action="diminuer" aria-label="Diminuer la quantité">−</button>
        <span class="valeur-qte">${quantite}</span>
        <button type="button" class="bouton-qte" data-action="augmenter" aria-label="Augmenter la quantité">+</button>
      </div>
      <p class="ligne-soustotal">${formaterPrix(sousTotal)}</p>
      <button type="button" class="bouton-supprimer" data-action="supprimer" aria-label="Supprimer l'article">🗑</button>
    </article>
  `;
}

function genererPanierVide() {
  return `
    <div class="panier-vide">
      <p>Votre panier est vide.</p>
      <a href="catalogue.html" class="bouton bouton-primaire">Voir le catalogue</a>
    </div>
  `;
}

/**
 * Affiche le contenu complet du panier.
 */
function afficherPanier(conteneur, produits) {
  const lignes = obtenirLignesPanier(produits);

  if (lignes.length === 0) {
    conteneur.innerHTML = genererPanierVide();
    return;
  }

  conteneur.innerHTML = `
    <div class="panier-liste">${lignes.map(genererLignePanier).join("")}</div>
    <div class="panier-total">
      <p class="panier-total-label">
        Total : <span class="panier-total-valeur">${formaterPrix(calculerTotalPanier(produits))}</span>
      </p>
    </div>
    <div class="panier-actions">
      <a href="https://wa.me/${NUMERO_WHATSAPP}?text=${construireMessageWhatsApp(produits)}"
         target="_blank" rel="noopener" class="bouton bouton-whatsapp" data-action="commander">
        Commander sur WhatsApp
      </a>
      <button type="button" class="bouton bouton-secondaire" data-action="vider">Vider le panier</button>
    </div>
  `;
}

/**
 * Exécute l'action du bouton cliqué, à partir des données de sa ligne.
 */
function executerAction(bouton) {
  const action = ACTIONS[bouton.dataset.action];
  if (!action) return;

  const ligne = bouton.closest(".ligne-panier")?.dataset ?? {};
  action({
    id: Number(ligne.id),
    taille: ligne.taille,
    quantite: Number(ligne.quantite),
  });
}

/**
 * Enregistre la commande sans bloquer l'utilisateur :
 * WhatsApp s'ouvre dans un nouvel onglet pendant que la requête part.
 */
function enregistrerCommandeEnArrierePlan(produits) {
  const articles = obtenirLignesPanier(produits).map(({ produit, taille, quantite }) => ({
    id: produit.id,
    nom: produit.nom,
    taille,
    quantite,
    prix: produit.prix,
  }));

  enregistrerCommande({ articles, total: calculerTotalPanier(produits) }).catch((erreur) =>
    console.error("Commande non enregistrée :", erreur)
  );
}

/**
 * Charge les produits, affiche le panier et gère tous les clics par délégation.
 * @param {HTMLElement} conteneur - conteneur #contenu-panier
 */
export async function initialiserPagePanier(conteneur) {
  conteneur.innerHTML = genererChargement();
  const produits = await recupererProduits();
  const rafraichir = () => afficherPanier(conteneur, produits);

  // Un seul écouteur pour tous les boutons, même ceux recréés à chaque affichage
  conteneur.addEventListener("click", (evenement) => {
    const cible = evenement.target.closest("[data-action]");
    if (!cible) return;

    if (cible.dataset.action === "commander") {
      enregistrerCommandeEnArrierePlan(produits);
      return;
    }

    executerAction(cible);
    rafraichir();
  });

  rafraichir();
}