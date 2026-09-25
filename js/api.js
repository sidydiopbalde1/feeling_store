/**
 * api.js — Seul fichier qui communique avec la base de données.
 */

import { supabase } from "./supabase.js";

/**
 * Récupère tous les produits, triés par nom.
 * @returns {Promise<Array>} liste des produits
 */
export async function recupererProduits() {
  const { data, error } = await supabase.from("produits").select("*").order("nom");

  if (error) throw new Error(`Impossible de charger les produits : ${error.message}`);
  return data;
}

/**
 * Récupère un seul produit à partir de son identifiant.
 * @param {number} id - identifiant du produit
 * @returns {Promise<Object>} le produit
 */
export async function recupererProduitParId(id) {
  const { data, error } = await supabase.from("produits").select("*").eq("id", id).single();

  if (error) throw new Error(`Produit introuvable : ${error.message}`);
  return data;
}

/**
 * Enregistre une commande dans la table "commandes".
 * @param {{ articles: Array, total: number }} commande
 */
export async function enregistrerCommande(commande) {
  const { error } = await supabase.from("commandes").insert(commande);

  if (error) throw new Error(`Impossible d'enregistrer la commande : ${error.message}`);
}