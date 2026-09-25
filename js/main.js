/**
 * main.js — Affichage et interactions des pages.
 * Ce fichier détecte sur quelle page on se trouve et appelle les fonctions correspondantes.
 */

/**
 * Affiche le header identique sur toutes les pages.
 * Le header contient le logo, la navigation et le badge du panier.
 */
function afficherHeader() {
  const header = document.querySelector("header");
  if (!header) return;
  header.innerHTML = `
    <div class="conteneur header-inner">
      <a href="index.html" class="logo-site">Feeling Store</a>
      <button class="bouton-menu" aria-label="Ouvrir le menu" onclick="basculerMenu()">
        <span></span><span></span><span></span>
      </button>
      <nav id="navigation" class="navigation">
        <a href="index.html">Accueil</a>
        <a href="catalogue.html">Catalogue</a>
        <a href="contact.html">Contact</a>
        <a href="panier.html" class="lien-panier">
          Panier
          <span class="badge-panier">0</span>
        </a>
      </nav>
    </div>
  `;
}

/**
 * Affiche le footer identique sur toutes les pages.
 */
function afficherFooter() {
  const footer = document.querySelector("footer");
  if (!footer) return;
  footer.innerHTML = `
    <div class="conteneur footer-inner">
      <p>&copy; 2026 Feeling Store - Dakar, Sénégal</p>
      <p>Tél / WhatsApp : 76 289 55 63</p>
      <nav class="footer-nav">
        <a href="index.html">Accueil</a>
        <a href="catalogue.html">Catalogue</a>
        <a href="contact.html">Contact</a>
      </nav>
    </div>
  `;
}

/**
 * Ouvre ou ferme le menu mobile.
 */
function basculerMenu() {
  const nav = document.getElementById("navigation");
  const bouton = document.querySelector(".bouton-menu");
  if (nav) {
    nav.classList.toggle("navigation-ouverte");
  }
  // Bascule aussi la classe sur le bouton pour l'animation en croix
  if (bouton) {
    bouton.classList.toggle("menu-ouvert");
  }
}

/**
 * Formate un prix en FCFA (fonction locale pour main.js).
 */
function formaterPrixLocal(prix) {
  return prix.toLocaleString("fr-FR").replace(/\u00A0/g, " ") + " FCFA";
}

/**
 * Génère le HTML d'une carte produit.
 * @param {Object} produit - objet produit
 * @returns {string} HTML de la carte
 */
function genererCarteProduit(produit) {
  return `
    <article class="carte-produit">
      <a href="produit.html?id=${produit.id}" class="carte-lien">
        <img src="${produit.image}" alt="${produit.nom}" class="carte-image" loading="lazy" />
        <div class="carte-corps">
          <span class="carte-badge">${produit.categorie}</span>
          <h3 class="carte-titre">${produit.nom}</h3>
          <p class="carte-prix">${formaterPrixLocal(produit.prix)}</p>
        </div>
      </a>
    </article>
  `;
}

/**
 * Affiche les 4 produits mis en avant sur la page d'accueil.
 */
function afficherProduitsAccueil() {
  const section = document.getElementById("produits-accueil");
  if (!section) return;
  const produitsAccroche = produits.slice(0, 4);
  section.innerHTML = produitsAccroche.map(genererCarteProduit).join("");
}

/**
 * Affiche tous les produits dans le catalogue, avec filtre et recherche.
 */
function afficherCatalogue() {
  const grille = document.getElementById("grille-catalogue");
  if (!grille) return;

  // Récupère les valeurs de filtre et de recherche
  const categorieSelectionnee = document.getElementById("filtre-categorie").value;
  const termeRecherche = document
    .getElementById("recherche")
    .value.toLowerCase()
    .trim();

  // Filtre les produits selon la catégorie et le terme de recherche
  let produitsFiltres = produits;
  if (categorieSelectionnee !== "Tous") {
    produitsFiltres = produitsFiltres.filter(
      (p) => p.categorie === categorieSelectionnee
    );
  }
  if (termeRecherche !== "") {
    produitsFiltres = produitsFiltres.filter((p) =>
      p.nom.toLowerCase().includes(termeRecherche)
    );
  }

  // Trie les produits filtrés par prix si demandé
  const triSelectionne = document.getElementById("tri-prix").value;
  if (triSelectionne === "croissant") {
    // slice() crée une copie pour ne pas modifier le tableau original
    produitsFiltres = produitsFiltres.slice().sort((a, b) => a.prix - b.prix);
  } else if (triSelectionne === "decroissant") {
    produitsFiltres = produitsFiltres.slice().sort((a, b) => b.prix - a.prix);
  }

  // Affiche un message si aucun produit ne correspond
  if (produitsFiltres.length === 0) {
    grille.innerHTML = "<p class='message-vide'>Aucun produit trouvé.</p>";
    return;
  }

  grille.innerHTML = produitsFiltres.map(genererCarteProduit).join("");
}

/**
 * Affiche la fiche d'un produit à partir de son ID dans l'URL.
 */
function afficherFicheProduit() {
  const conteneur = document.getElementById("fiche-produit");
  if (!conteneur) return;

  // Récupère l'ID du produit depuis l'URL
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);
  const produit = produits.find((p) => p.id === id);

  if (!produit) {
    conteneur.innerHTML = `
      <p class="message-vide">Produit introuvable.</p>
      <a href="catalogue.html" class="bouton bouton-primaire">Retour au catalogue</a>
    `;
    return;
  }

  // Met à jour le titre de la page
  document.title = produit.nom + " - Feeling Store";

  // Génère les boutons de taille
  const boutonsTailles = produit.tailles
    .map(
      (taille, index) =>
        `<button type="button" class="bouton-taille${index === 0 ? " taille-selectionnee" : ""}" data-taille="${taille}">${taille}</button>`
    )
    .join("");

  conteneur.innerHTML = `
    <div class="fiche-contenu">
      <img src="${produit.image}" alt="${produit.nom}" class="fiche-image" />
      <div class="fiche-details">
        <span class="carte-badge">${produit.categorie}</span>
        <h1 class="fiche-titre">${produit.nom}</h1>
        <p class="fiche-prix">${formaterPrixLocal(produit.prix)}</p>
        <p class="fiche-description">${produit.description}</p>
        <div class="fiche-tailles">
          <p class="fiche-label">Choisir la taille :</p>
          <div class="tailles-liste" id="tailles-liste">
            ${boutonsTailles}
          </div>
        </div>
        <button type="button" class="bouton bouton-primaire" id="bouton-ajouter">
          Ajouter au panier
        </button>
        <p id="confirmation-ajout" class="confirmation-ajout"></p>
        <a href="catalogue.html" class="lien-retour">← Retour au catalogue</a>
      </div>
    </div>
  `;

  // Gère la sélection de la taille
  let tailleSelectionnee = produit.tailles[0];
  const boutons = document.querySelectorAll(".bouton-taille");
  boutons.forEach((bouton) => {
    bouton.addEventListener("click", () => {
      boutons.forEach((b) => b.classList.remove("taille-selectionnee"));
      bouton.classList.add("taille-selectionnee");
      tailleSelectionnee = bouton.dataset.taille;
    });
  });

  // Gère l'ajout au panier
  document.getElementById("bouton-ajouter").addEventListener("click", () => {
    ajouterAuPanier(produit.id, tailleSelectionnee, 1);
    const confirmation = document.getElementById("confirmation-ajout");
    confirmation.textContent =
      "✓ " + produit.nom + " (taille " + tailleSelectionnee + ") ajouté au panier !";
    confirmation.style.display = "block";
    setTimeout(() => {
      confirmation.style.display = "none";
    }, 3000);
  });
}

/**
 * Affiche le contenu du panier sur la page panier.html
 */
function afficherPanier() {
  const conteneur = document.getElementById("contenu-panier");
  if (!conteneur) return;

  const panier = obtenirPanier();

  if (panier.length === 0) {
    conteneur.innerHTML = `
      <div class="panier-vide">
        <p>Votre panier est vide.</p>
        <a href="catalogue.html" class="bouton bouton-primaire">Voir le catalogue</a>
      </div>
    `;
    return;
  }

  // Génère les lignes du panier
  let lignesHTML = "";
  panier.forEach((article) => {
    const produit = produits.find((p) => p.id === article.id);
    if (!produit) return;
    lignesHTML += `
      <article class="ligne-panier">
        <img src="${produit.image}" alt="${produit.nom}" class="ligne-image" />
        <div class="ligne-infos">
          <h3 class="ligne-nom">${produit.nom}</h3>
          <p class="ligne-taille">Taille : ${article.taille}</p>
          <p class="ligne-prix-unitaire">${formaterPrixLocal(produit.prix)} / unité</p>
        </div>
        <div class="ligne-quantite">
          <button type="button" class="bouton-qte" onclick="changerQuantite(${produit.id}, '${article.taille}', -1)" aria-label="Diminuer">−</button>
          <span class="valeur-qte">${article.quantite}</span>
          <button type="button" class="bouton-qte" onclick="changerQuantite(${produit.id}, '${article.taille}', 1)" aria-label="Augmenter">+</button>
        </div>
        <p class="ligne-soustotal">${formaterPrixLocal(produit.prix * article.quantite)}</p>
        <button type="button" class="bouton-supprimer" onclick="retirerArticle(${produit.id}, '${article.taille}')" aria-label="Supprimer">🗑</button>
      </article>
    `;
  });

  conteneur.innerHTML = `
    <div class="panier-liste">${lignesHTML}</div>
    <div class="panier-total">
      <p class="panier-total-label">Total : <span class="panier-total-valeur">${formaterPrixLocal(calculerTotalPanier())}</span></p>
    </div>
    <div class="panier-actions">
      <a href="https://wa.me/221762895563?text=${construireMessageWhatsApp()}"
         target="_blank"
         rel="noopener"
         class="bouton bouton-whatsapp">
        Commander sur WhatsApp
      </a>
      <button type="button" class="bouton bouton-secondaire" onclick="viderPanierPage()">Vider le panier</button>
    </div>
  `;
}

/**
 * Augmente ou diminue la quantité d'un article depuis la page panier.
 */
function changerQuantite(id, taille, delta) {
  const panier = obtenirPanier();
  const article = panier.find(
    (a) => a.id === id && a.taille === taille
  );
  if (article) {
    modifierQuantite(id, taille, article.quantite + delta);
    afficherPanier();
  }
}

/**
 * Retire un article du panier depuis la page panier.
 */
function retirerArticle(id, taille) {
  supprimerDuPanier(id, taille);
  afficherPanier();
}

/**
 * Vide le panier depuis la page panier.
 */
function viderPanierPage() {
  viderPanier();
  afficherPanier();
}

/**
 * Initialise la page courante selon son contenu.
 */
function initialiserPage() {
  afficherHeader();
  afficherFooter();
  mettreAJourBadgePanier();

  // Détection de la page selon les éléments présents
  if (document.getElementById("produits-accueil")) {
    afficherProduitsAccueil();
  }
  if (document.getElementById("grille-catalogue")) {
    afficherCatalogue();
    // Ajoute les écouteurs pour le filtre et la recherche
    document.getElementById("filtre-categorie").addEventListener("change", afficherCatalogue);
    document.getElementById("recherche").addEventListener("input", afficherCatalogue);
    document.getElementById("tri-prix").addEventListener("change", afficherCatalogue);
  }
  if (document.getElementById("fiche-produit")) {
    afficherFicheProduit();
  }
  if (document.getElementById("contenu-panier")) {
    afficherPanier();
  }
}

// Attend que la page soit chargée avant d'initialiser
document.addEventListener("DOMContentLoaded", initialiserPage);
