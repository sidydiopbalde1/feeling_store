import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const racine = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        accueil: resolve(racine, 'index.html'),
        catalogue: resolve(racine, 'catalogue.html'),
        produit: resolve(racine, 'produit.html'),
        panier: resolve(racine, 'panier.html'),
        contact: resolve(racine, 'contact.html'),
      },
    },
  },
});