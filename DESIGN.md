# DESIGN.md — Guidelines design FASOYAAR

Ce fichier est la référence design du projet. Toute modification UI doit s'y conformer.

## 1. Règles non négociables

1. **Zéro émoji brut** dans l'interface : les icônes sont des SVG propres issus de **lucide-react** (ex. `Store`, `MapPin`, `Landmark`, `ArrowRight`). Aucun caractère emoji dans les pages ou composants.
2. **Réutiliser les composants**, jamais recréer du CSS inline dupliqué. Tout bouton passe par `Button`, tout champ par `Field` + `Input`/`Select`, toute carte par `Card`, toute pastille par `Badge`, tout tableau par `Table`. Les blocs partagés vivent dans `src/components/ui/` (`IconTile`, `Flag`).
3. **Surfaces plates et épurées** : fonds blancs, bordures `border-zinc-200`, coins arrondis `rounded-2xl`, aucune ombre lourde. Les dégradés autorisés sont le **gradient drapeau** (top-bar `from-bf-red via-bf-yellow to-bf-green`) et l'ambiance drapeau en fond de page (voir §2).

## 2. Fond et ambiance

L'identité vit dans toute la page, pas seulement dans les cartes :

- **Lavis drapeau** (`globals.css`, sur `body`) : fines rayures diagonales rouges (fabric du tissu burkinabè, ~2 % d'opacité) + halo rouge en haut à gauche + halo vert en bas à droite + dégradé vertical blanc chaud → vert pâle.
- **Watermark drapeau** (`FlagBackdrop`, rendu par `layout.tsx`) : deux drapeaux SVG très larges, fixes, à ~4 % d'opacité, l'un en haut à droite (incliné), l'autre en bas à gauche, + halo jaune diffus au centre. Calque `-z-10`, `pointer-events-none`, `aria-hidden`.
- Sélection de texte : fond vert drapeau, texte blanc.
- Focus clavier : contour vert drapeau de 2 px (`:focus-visible` global).
- Micro-interactions : pression `active:scale-[0.98]` sur `Button` ; survol des cartes/liens = bordure verte + fond `bg-bf-green/[0.04]` + icône accent rouge.

## 3. Palette

| Rôle | Classe Tailwind | Valeur |
| --- | --- | --- |
| Rouge drapeau (accent, lien Google Maps, erreurs) | `text-bf-red`, `bg-bf-red` | `#ef2b2d` |
| Rouge drapeau foncé (hover) | `bg-bf-red-dark` | `#c1121f` |
| Jaune drapeau (étoile) | `text-bf-yellow`, `fill-bf-yellow` | `#fcd116` |
| Vert drapeau (action principale, survol) | `bg-bf-green` | `#009e49` |
| Vert drapeau foncé (hover) | `bg-bf-green-dark` | `#00703a` |
| Texte principal | `text-zinc-900` | — |
| Texte secondaire | `text-zinc-500` / `text-zinc-600` | — |
| Surfaces | `bg-white` | — |
| Bordures / séparateurs | `border-zinc-200`, `border-zinc-100` | — |

## 4. Typographie

- Police : Geist (déjà chargée dans `layout.tsx`).
- Titres de page : `text-3xl font-extrabold tracking-tight` (accompagnés d'un `IconTile` et d'un sous-titre `text-zinc-500`).
- Marque (accueil) : `text-3xl font-extrabold tracking-tight` ; noms de cartes : `font-semibold text-zinc-900`.
- Libellés / badges : `text-sm font-medium text-zinc-600`.

## 5. Composants partagés (`src/components/ui/`)

- `Button` — variantes : `primary` (action principale, vert), `dark` (CTA Google Maps), `outline`, `danger` (suppression), `ghost` (filtres/onglets, avec `active`).
- `Field` / `Input` / `Select` — libellé + champ avec le style standard des formulaires.
- `Card` — panneau blanc `rounded-2xl border-zinc-200` (peut recevoir une top-bar gradient drapeau via `overflow-hidden`).
- `Badge` — pastille `rounded-full`.
- `IconTile` — tuile `rounded-xl` porteuse d'icône (accent par classe : `bg-bf-red/10 text-bf-red`, `bg-bf-green/10 text-bf-green`, `bg-zinc-100 text-zinc-500`).
- `Flag` — SVG du drapeau du Burkina (rouge, vert, étoile jaune), utilisé comme motif d'identité (accueil, footer).
- `FlagBackdrop` — calque de fond fixe : watermarks drapeau + halo jaune (rendu une seule fois dans `layout.tsx`).
- `Table` + `THead`/`TR`/`TH`/`TD` — tableau admin standard.
- `Logo` / `Wordmark` — identité « FASO★YAAR », sous-titre « Localisateur de sites de vente ».

## 6. Icônes par type de site

| Type | Icône lucide |
| --- | --- |
| Supermarché | `Store` |
| Marché | `ShoppingBasket` |
| Boutique | `ShoppingBag` |
| défaut | `Store` |

- Accueil : `Landmark` pour les villes, `MapPin` pour la question, `ArrowRight` pour la flèche de survol.
- Cartes de sites : `MapPin` pour l'adresse, `ExternalLink` pour le lien Google Maps.

## 7. Interdits

- Émojis bruts, symboles unicode décoratifs (`★`, `→`, `➕`, `×`, drapeaux).
- Classes CSS répétées à la main : utiliser les composants ci-dessus.
- Chaînes de classes conditionnelles redondantes pour les boutons/filtres.
- Ombres lourdes, dégradés décoratifs hors gradient drapeau.
