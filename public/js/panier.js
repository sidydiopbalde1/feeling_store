/**
 * panier.js — Gère toute la logique du panier :
 * lecture, ajout, suppression, modification de quantité, sauvegarde dans localStorage.
 */

// Clé utilisée pour stocker le panier dans localStorage
const CLE_PANIER = "feeling_store_panier";

/**
 * Récupère le panier depuis localStorage.
 * Retourne un tableau d'objets { id, taille, quantite }.
 */
function obtenirPanier() {
  const donnees = localStorage.getItem(CLE_PANIER);
  if (donnees === null) {
    return [];
  }
  return JSON.parse(donnees);
}

/**
 * Sauvegarde le panier dans localStorage.
 * @param {Array} panier - tableau d'objets { id, taille, quantite }
 */
function sauvegarderPanier(panier) {
  localStorage.setItem(CLE_PANIER, JSON.stringify(panier));
  mettreAJourBadgePanier();
}

/**
 * Ajoute un produit au panier. Si le produit existe déjà avec la même taille,
 * on augmente juste la quantité.
 * @param {number} id - identifiant du produit
 * @param {string} taille - taille choisie
 * @param {number} quantite - quantite à ajouter (défaut : 1)
 */
function ajouterAuPanier(id, taille, quantite = 1) {
  const panier = obtenirPanier();
  // Cherche si ce produit avec cette taille est déjà dans le panier
  const index = panier.findIndex(
    (article) => article.id === id && article.taille === taille
  );
  if (index !== -1) {
    panier[index].quantite += quantite;
  } else {
    panier.push({ id: id, taille: taille, quantite: quantite });
  }
  sauvegarderPanier(panier);
}

/**
 * Supprime un article du panier.
 * @param {number} id - identifiant du produit
 * @param {string} taille - taille de l'article à supprimer
 */
function supprimerDuPanier(id, taille) {
  let panier = obtenirPanier();
  panier = panier.filter(
    (article) => !(article.id === id && article.taille === taille)
  );
  sauvegarderPanier(panier);
}

/**
 * Modifie la quantité d'un article dans le panier.
 * Si la quantité devient 0, l'article est supprimé.
 * @param {number} id - identifiant du produit
 * @param {string} taille - taille de l'article
 * @param {number} nouvelleQuantite - nouvelle quantité
 */
function modifierQuantite(id, taille, nouvelleQuantite) {
  if (nouvelleQuantite <= 0) {
    supprimerDuPanier(id, taille);
    return;
  }
  const panier = obtenirPanier();
  const index = panier.findIndex(
    (article) => article.id === id && article.taille === taille
  );
  if (index !== -1) {
    panier[index].quantite = nouvelleQuantite;
    sauvegarderPanier(panier);
  }
}

/**
 * Calcule le nombre total d'articles dans le panier.
 * @returns {number} somme des quantités
 */
function compterArticles() {
  const panier = obtenirPanier();
  return panier.reduce((total, article) => total + article.quantite, 0);
}

/**
 * Calcule le prix total du panier.
 * @returns {number} total en FCFA
 */
function calculerTotalPanier() {
  const panier = obtenirPanier();
  return panier.reduce((total, article) => {
    const produit = produits.find((p) => p.id === article.id);
    if (produit) {
      return total + produit.prix * article.quantite;
    }
    return total;
  }, 0);
}

/**
 * Vide entièrement le panier.
 */
function viderPanier() {
  localStorage.removeItem(CLE_PANIER);
  mettreAJourBadgePanier();
}

/**
 * Met à jour le badge dans le header affichant le nombre d'articles.
 */
function mettreAJourBadgePanier() {
  const badge = document.querySelector(".badge-panier");
  if (badge) {
    const nombre = compterArticles();
    badge.textContent = nombre;
    badge.style.display = nombre > 0 ? "inline-flex" : "none";
  }
}

/**
 * Construit le message WhatsApp avec les articles du panier et le total.
 * @returns {string} message pré-formé pour WhatsApp
 */
function construireMessageWhatsApp() {
  const panier = obtenirPanier();
  let message = "Bonjour Feeling Store !\nJe souhaite commander :\n\n";
  panier.forEach((article) => {
    const produit = produits.find((p) => p.id === article.id);
    if (produit) {
      message += "• " + produit.nom;
      message += " (Taille : " + article.taille + ")";
      message += " x" + article.quantite;
      message += " = " + formaterPrix(produit.prix * article.quantite) + "\n";
    }
  });
  message += "\nTotal : " + formaterPrix(calculerTotalPanier()) + "\n";
  message += "\nMerci de me confirmer la disponibilité.";
  return encodeURIComponent(message);
}

/**
 * Formate un prix en FCFA avec séparateur d'espaces.
 * Exemple : 15000 → "15 000 FCFA"
 * @param {number} prix - prix en FCFA
 * @returns {string} prix formaté
 */
function formaterPrix(prix) {
  return prix.toLocaleString("fr-FR").replace(/\u00A0/g, " ") + " FCFA";
}
