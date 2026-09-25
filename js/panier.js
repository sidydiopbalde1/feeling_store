/**
 * panier.js — Gère toute la logique du panier :
 * lecture, ajout, suppression, modification de quantité, sauvegarde dans localStorage.
 * Les produits ne sont jamais lus ici : ils sont passés en paramètre.
 */

import { formaterPrix } from "./utils.js";

// Clé utilisée pour stocker le panier dans localStorage
const CLE_PANIER = "feeling_store_panier";

/**
 * Récupère le panier depuis localStorage.
 * Retourne un panier vide si les données sont absentes ou corrompues.
 * @returns {Array} tableau d'objets { id, taille, quantite }
 */
export function obtenirPanier() {
  try {
    const donnees = localStorage.getItem(CLE_PANIER);
    return donnees ? JSON.parse(donnees) : [];
  } catch {
    localStorage.removeItem(CLE_PANIER);
    return [];
  }
}

/**
 * Sauvegarde le panier dans localStorage et met à jour le badge.
 * @param {Array} panier - tableau d'objets { id, taille, quantite }
 */
function sauvegarderPanier(panier) {
  localStorage.setItem(CLE_PANIER, JSON.stringify(panier));
  mettreAJourBadgePanier();
}

/**
 * Trouve la position d'un article dans le panier.
 * @returns {number} index de l'article, ou -1 s'il est absent
 */
function trouverIndexArticle(panier, id, taille) {
  return panier.findIndex(
    (article) => article.id === id && article.taille === taille
  );
}

/**
 * Ajoute un produit au panier. Si le produit existe déjà avec la même taille,
 * on augmente juste la quantité.
 * @param {number} id - identifiant du produit
 * @param {string} taille - taille choisie
 * @param {number} quantite - quantité à ajouter (défaut : 1)
 */
export function ajouterAuPanier(id, taille, quantite = 1) {
  const panier = obtenirPanier();
  const index = trouverIndexArticle(panier, id, taille);

  if (index !== -1) {
    panier[index].quantite += quantite;
  } else {
    panier.push({ id, taille, quantite });
  }
  sauvegarderPanier(panier);
}

/**
 * Supprime un article du panier.
 * @param {number} id - identifiant du produit
 * @param {string} taille - taille de l'article à supprimer
 */
export function supprimerDuPanier(id, taille) {
  const panier = obtenirPanier().filter(
    (article) => !(article.id === id && article.taille === taille)
  );
  sauvegarderPanier(panier);
}

/**
 * Modifie la quantité d'un article. Si elle devient 0, l'article est supprimé.
 * @param {number} id - identifiant du produit
 * @param {string} taille - taille de l'article
 * @param {number} nouvelleQuantite - nouvelle quantité
 */
export function modifierQuantite(id, taille, nouvelleQuantite) {
  if (nouvelleQuantite <= 0) {
    supprimerDuPanier(id, taille);
    return;
  }
  const panier = obtenirPanier();
  const index = trouverIndexArticle(panier, id, taille);

  if (index !== -1) {
    panier[index].quantite = nouvelleQuantite;
    sauvegarderPanier(panier);
  }
}

/**
 * Vide entièrement le panier.
 */
export function viderPanier() {
  localStorage.removeItem(CLE_PANIER);
  mettreAJourBadgePanier();
}

/**
 * Calcule le nombre total d'articles dans le panier.
 * @returns {number} somme des quantités
 */
export function compterArticles() {
  return obtenirPanier().reduce((total, article) => total + article.quantite, 0);
}

/**
 * Associe chaque article du panier à son produit complet.
 * Les articles dont le produit n'existe plus sont ignorés.
 * @param {Array} produits - liste des produits (venant de Supabase)
 * @returns {Array} tableau d'objets { produit, taille, quantite, sousTotal }
 */
export function obtenirLignesPanier(produits) {
  return obtenirPanier()
    .map((article) => {
      const produit = produits.find((p) => p.id === article.id);
      if (!produit) return null;
      return {
        produit,
        taille: article.taille,
        quantite: article.quantite,
        sousTotal: produit.prix * article.quantite,
      };
    })
    .filter(Boolean);
}

/**
 * Calcule le prix total du panier.
 * @param {Array} produits - liste des produits
 * @returns {number} total en FCFA
 */
export function calculerTotalPanier(produits) {
  return obtenirLignesPanier(produits).reduce(
    (total, ligne) => total + ligne.sousTotal,
    0
  );
}

/**
 * Construit le message WhatsApp avec les articles du panier et le total.
 * @param {Array} produits - liste des produits
 * @returns {string} message encodé pour une URL WhatsApp
 */
export function construireMessageWhatsApp(produits) {
  const lignes = obtenirLignesPanier(produits)
    .map(
      ({ produit, taille, quantite, sousTotal }) =>
        `• ${produit.nom} (Taille : ${taille}) x${quantite} = ${formaterPrix(sousTotal)}`
    )
    .join("\n");

  const message = [
    "Bonjour Feeling Store !",
    "Je souhaite commander :",
    "",
    lignes,
    "",
    `Total : ${formaterPrix(calculerTotalPanier(produits))}`,
    "",
    "Merci de me confirmer la disponibilité.",
  ].join("\n");

  return encodeURIComponent(message);
}

/**
 * Met à jour le badge du header affichant le nombre d'articles.
 */
export function mettreAJourBadgePanier() {
  const badge = document.querySelector(".badge-panier");
  if (!badge) return;

  const nombre = compterArticles();
  badge.textContent = nombre;
  badge.style.display = nombre > 0 ? "inline-flex" : "none";
}