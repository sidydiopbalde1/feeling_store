/**
 * layout.js — Header, footer et menu mobile, communs à toutes les pages.
 */

import { TELEPHONE_AFFICHE } from "./config.js";

const LIENS_NAVIGATION = [
  { href: "index.html", libelle: "Accueil" },
  { href: "catalogue.html", libelle: "Catalogue" },
  { href: "contact.html", libelle: "Contact" },
];

/**
 * Génère les liens d'une barre de navigation.
 * @param {Array} liens - tableau d'objets { href, libelle }
 * @returns {string} HTML des liens
 */
function genererLiens(liens) {
  return liens.map(({ href, libelle }) => `<a href="${href}">${libelle}</a>`).join("");
}

/**
 * Affiche le header : logo, bouton du menu mobile, navigation et badge du panier.
 */
function afficherHeader() {
  const header = document.querySelector("header");
  if (!header) return;

  header.innerHTML = `
    <div class="conteneur header-inner">
      <a href="index.html" class="logo-site">Feeling Store</a>
      <button type="button" class="bouton-menu" aria-label="Ouvrir le menu"
              aria-controls="navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <nav id="navigation" class="navigation">
        ${genererLiens(LIENS_NAVIGATION)}
        <a href="panier.html" class="lien-panier">
          Panier
          <span class="badge-panier">0</span>
        </a>
      </nav>
    </div>
  `;
}

/**
 * Affiche le footer.
 */
function afficherFooter() {
  const footer = document.querySelector("footer");
  if (!footer) return;

  footer.innerHTML = `
    <div class="conteneur footer-inner">
      <p>&copy; ${new Date().getFullYear()} Feeling Store - Dakar, Sénégal</p>
      <p>Tél / WhatsApp : ${TELEPHONE_AFFICHE}</p>
      <nav class="footer-nav">${genererLiens(LIENS_NAVIGATION)}</nav>
    </div>
  `;
}

/**
 * Ouvre et ferme le menu mobile au clic sur le bouton hamburger.
 */
function initialiserMenuMobile() {
  const bouton = document.querySelector(".bouton-menu");
  const navigation = document.getElementById("navigation");
  if (!bouton || !navigation) return;

  bouton.addEventListener("click", () => {
    const estOuvert = navigation.classList.toggle("navigation-ouverte");
    bouton.classList.toggle("menu-ouvert", estOuvert);
    bouton.setAttribute("aria-expanded", String(estOuvert));
  });
}

/**
 * Met en place les éléments communs à toutes les pages.
 */
export function afficherMiseEnPage() {
  afficherHeader();
  afficherFooter();
  initialiserMenuMobile();
}