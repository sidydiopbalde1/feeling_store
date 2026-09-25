/**
 * produits.js — Contient uniquement les données des 12 produits.
 * Chaque produit a : id, nom, categorie, prix (en FCFA), description, tailles, image.
 */

// Tableau des produits vendus par Feeling Store
const produits = [
  {
    id: 1,
    nom: "Chemise en lin homme",
    categorie: "Homme",
    prix: 15000,
    description: "Chemise en lin léger, idéale pour la chaleur de Dakar. Coupe ajustée, col cubain, boutons en nacre.",
    tailles: ["S", "M", "L", "XL"],
    image: "https://images.pexels.com/photos/39649871/pexels-photo-39649871.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    id: 2,
    nom: "T-shirt blanc basique homme",
    categorie: "Homme",
    prix: 8000,
    description: "T-shirt en coton bio, col rond, manches courtes. Confortable et respirant pour tous les jours.",
    tailles: ["S", "M", "L", "XL", "XXL"],
    image: "https://images.pexels.com/photos/19915586/pexels-photo-19915586.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    id: 3,
    nom: "Chemise à carreaux homme",
    categorie: "Homme",
    prix: 12000,
    description: "Chemise à carreaux en flanelle douce. Parfaite pour les soirées fraîches au bord de la mer.",
    tailles: ["M", "L", "XL"],
    image: "https://images.pexels.com/photos/30283737/pexels-photo-30283737.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    id: 4,
    nom: "Chemise blanche casual homme",
    categorie: "Homme",
    prix: 10000,
    description: "Chemise blanche polyvalente, parfaite pour le bureau ou une sortie. Tissu respirant.",
    tailles: ["S", "M", "L", "XL"],
    image: "https://images.pexels.com/photos/19915633/pexels-photo-19915633.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    id: 5,
    nom: "Robe d'été fleurie femme",
    categorie: "Femme",
    prix: 18000,
    description: "Robe légère à motifs floraux, parfaite pour les journées ensoleillées. Tissu fluide et agréable.",
    tailles: ["XS", "S", "M", "L"],
    image: "https://images.pexels.com/photos/26888866/pexels-photo-26888866.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    id: 6,
    nom: "Robe bleue élégante femme",
    categorie: "Femme",
    prix: 22000,
    description: "Robe bleue rayée, style décontracté chic. Idéale pour une sortie ou un événement.",
    tailles: ["XS", "S", "M", "L"],
    image: "https://images.pexels.com/photos/4428388/pexels-photo-4428388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    id: 7,
    nom: "Mini robe trendy femme",
    categorie: "Femme",
    prix: 16000,
    description: "Mini robe moderne près du corps, parfaite pour mettre en valeur votre silhouette.",
    tailles: ["XS", "S", "M"],
    image: "https://images.pexels.com/photos/5314574/pexels-photo-5314574.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    id: 8,
    nom: "Robe jaune ensoleillée femme",
    categorie: "Femme",
    prix: 20000,
    description: "Robe jaune vif, idéale pour apporter de la couleur à votre garde-robe. Talons recommandés.",
    tailles: ["S", "M", "L"],
    image: "https://images.pexels.com/photos/5199942/pexels-photo-5199942.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    id: 9,
    nom: "Sac à main cuir croco",
    categorie: "Accessoires",
    prix: 25000,
    description: "Sac à main en cuir effet croco, noir et marron. Élégant et spacieux pour vos sorties.",
    tailles: ["Unique"],
    image: "https://images.pexels.com/photos/27046146/pexels-photo-27046146.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    id: 10,
    nom: "Sac à main rouge fashion",
    categorie: "Accessoires",
    prix: 23000,
    description: "Sac à main rouge vif avec lunettes de soleil assorties. Pour un look audacieux et coloré.",
    tailles: ["Unique"],
    image: "https://images.pexels.com/photos/19869754/pexels-photo-19869754.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    id: 11,
    nom: "Montre bracelet cuir luxe",
    categorie: "Accessoires",
    prix: 35000,
    description: "Montre chronographe avec bracelet en cuir. Design luxueux pour homme élégant.",
    tailles: ["Unique"],
    image: "https://images.pexels.com/photos/28977357/pexels-photo-28977357.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    id: 12,
    nom: "Montre cadran bleu élégance",
    categorie: "Accessoires",
    prix: 30000,
    description: "Montre au cadran bleu, bracelet métallique. Un accessoire raffiné pour toutes occasions.",
    tailles: ["Unique"],
    image: "https://images.pexels.com/photos/6157411/pexels-photo-6157411.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  }
];
