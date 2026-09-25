/**
 * utils.js — Fonctions utilitaires partagées par tout le site.
 */

const CARACTERES_HTML = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Formate un prix en FCFA avec séparateur d'espaces.
 * Exemple : 15000 → "15 000 FCFA"
 * @param {number} prix - prix en FCFA
 * @returns {string} prix formaté
 */
export function formaterPrix(prix) {
  // fr-FR utilise des espaces insécables (\u00A0 ou \u202F selon le navigateur)
  return prix.toLocaleString("fr-FR").replace(/[\u00A0\u202F]/g, " ") + " FCFA";
}

/**
 * Neutralise les caractères spéciaux avant d'insérer un texte dans du HTML.
 * Empêche un contenu venant de la base d'injecter du code dans la page.
 * @param {*} texte - valeur à afficher
 * @returns {string} texte sans danger pour innerHTML
 */
export function echapperHtml(texte) {
  return String(texte ?? "").replace(/[&<>"']/g, (caractere) => CARACTERES_HTML[caractere]);
}