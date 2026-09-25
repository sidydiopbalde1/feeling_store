import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
         catalogue: resolve(__dirname, 'catalogue.html'),
          panier: resolve(__dirname, 'panier.html'),
         contact: resolve(__dirname, 'contact.html'),
        produit : resolve(__dirname, 'produit.html')
      }
    }
  }
})