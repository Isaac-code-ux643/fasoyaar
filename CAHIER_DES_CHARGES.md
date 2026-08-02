# FASOYAAR — Cahier des charges

Comparateur de prix et localisateur de produits au Burkina Faso.

---

## 1. Objectif

Permettre à un utilisateur de :
1. Choisir sa ville.
2. Rechercher/parcourir un produit (nom, photo, prix unitaire, prix carton).
3. Voir **sur une carte** tous les sites (marchés / magasins) de la ville où ce produit est disponible.

Démarrage sur le réseau **FASOYAAR**, extension possible aux autres enseignes et marchés.

---

## 2. Public cible

- Particuliers qui comparent les prix avant d'acheter.
- Commerçants et détaillants qui veulent connaître le prix carton.
- Toute personne qui veut savoir **où** trouver un produit sans se déplacer.

---

## 3. Parcours utilisateur (MVP)

### 3.1 Choix de la ville
- Page d'accueil : liste des villes disponibles (Ouagadougou, Bobo-Dioulasso, Koudougou, Banfora, Ouahigouya…).
- La sélection est mémorisée (localStorage) et modifiable à tout moment.

### 3.2 Catalogue / Recherche
- Liste des produits avec photo, nom, prix unitaire.
- Recherche par texte (nom du produit, marque).
- Filtres par catégorie (Huile, Riz, Lait, Sucre, Boissons, Produits d'entretien, Hygiène…).

### 3.3 Page produit
- Photo du produit.
- Nom, marque, catégorie.
- **Prix unitaire** (FCFA).
- **Prix carton** (FCFA) + **nombre d'unités par carton** (ex : carton de 12).
- Liste des sites où il est disponible, triée par prix croissant.
- Bouton "Voir sur la carte".

### 3.4 Carte des sites
- Carte de la ville (OpenStreetMap + Leaflet).
- Un marqueur par site où le produit est dispo.
- Clic sur un marqueur → adresse + prix du produit dans ce site.
- Au niveau ville : carte de **tous** les sites, avec les coordonnées GPS exactes.

### 3.5 Page site (magasin)
- Nom, adresse, localisation sur carte.
- Liste des produits disponibles dans ce site (avec prix).

---

## 4. Modèle de données

| Table | Champs |
|-------|--------|
| **cities** | id, name, country |
| **stores** | id, city_id, name, address, latitude, longitude, type |
| **categories** | id, name, slug, icon |
| **products** | id, category_id, name, brand, description, photo_url, unit_label |
| **listings** | id, product_id, store_id, price_unit, price_carton, units_per_carton, updated_at |
| **users** (admin) | id, email, password_hash, role |

### Règles
- Un `listing` = produit disponible à un prix donné dans un site donné.
- `units_per_carton` est optionnel et **"à compléter"** tant que non renseigné (cas d'usage : le nombre de pièces du carton n'est pas toujours connu).
- Chaque `store` appartient à une `city` → la carte ne montre que les sites de la ville sélectionnée.

---

## 5. Écrans (MVP)

1. **Accueil / choix de ville**
2. **Catalogue** (filtres + recherche)
3. **Page produit** (prix unitaire/carton, dispo par site)
4. **Carte de la ville** (tous les sites)
5. **Page site** (adresse, carte, produits)
6. **Admin** : CRUD villes, sites, catégories, produits, prix

---

## 6. Stack technique

| Couche | Choix | Pourquoi |
|--------|-------|----------|
| Front | **Next.js (App Router) + Tailwind CSS** | SEO, rapidité, composants |
| Back/DB | **Supabase** (PostgreSQL + Auth + Storage) | Zéro serveur à gérer, upload photos |
| Carte | **Leaflet + OpenStreetMap** | Gratuit, pas de clé API |
| Déploiement | **Vercel** | Déploiement git simple, gratuit |

---

## 7. Collecte des données (la partie critique)

1. **Phase 1** : inventaire manuel d'environ **50 produits** courants (huile, riz, lait, sucre, savon, boissons…) avec photos et prix relevés sur le terrain.
2. **Phase 2** : prix participatifs — formulaire/WhatsApp pour que les utilisateurs soumettent un prix, validation par un modérateur.
3. **Phase 3** : partenariats avec les enseignes pour publication officielle des prix.

---

## 8. Roadmap

### V1 (MVP) — livrable de base
- Choix de ville, catalogue, page produit, carte des sites, admin.

### V2
- Comparaison de prix entre sites.
- Alertes de baisse de prix.
- Partage WhatsApp ("Prix du riz à FASOYAAR Ouaga 2000 : 12 500 F").
- Soumission de prix par les utilisateurs + modération.

### V3
- Autres enseignes et marchés.
- App mobile (PWA).
- Publicité / mise en avant de produits (monétisation).

---

## 9. Risques et parades

| Risque | Parade |
|--------|--------|
| Données de prix qui se périmenent | Marquer la date de relevé, mention "prix relevé le X" |
| Effort de saisie initial | Réduire à 50 produits, format participatif ensuite |
| Précision GPS des sites | Relevé manuel sur Google Maps puis copie des coordonnées |
| Concurrence de données | Lien direct terrain + communauté, priorité à la fraîcheur |

---

## 10. Monétisation (plus tard)

- Mise en avant de produits / sponsors.
- Abonnement "pro" pour commerçants (suivi des prix fournisseurs).
- Partenariats enseignes.
