# DESIGN.md — Guidelines design FASOYAAR

Ce fichier est la référence design du projet. Toute modification UI doit s'y conformer.

## 1. Règles non négociables

1. **Zéro émoji brut** dans l'interface : les icônes sont des SVG propres issus de **lucide-react** (ex. `Store`, `MapPin`, `Package`, `Star`). Aucun caractère emoji (🛢️ 🌾 📍 🔐 …) dans les pages ou composants.
2. **Réutiliser les composants**, jamais recréer du CSS inline dupliqué. Tout bouton passe par `Button`, tout champ par `Field` + `Input`/`Select`, toute carte par `Card`, tout tableau par `Table`. Les blocs partagés vivent dans `src/components/ui/`.
3. **Surfaces plates et épurées** : fonds blancs, bordures `border-zinc-200`, coins arrondis `rounded-2xl`, aucune ombre lourde ni dégradé décoratif hors bannière du drapeau (top-bar + blocs d'accent).

## 2. Palette

| Rôle | Classe Tailwind | Valeur |
| --- | --- | --- |
| Rouge drapeau (accent, prix, erreurs) | `text-bf-red`, `bg-bf-red` | `#ef2b2d` |
| Jaune drapeau (étoile du logo) | `text-bf-yellow`, `fill-bf-yellow` | `#fcd116` |
| Vert drapeau (action principale) | `bg-bf-green` | `#009e49` |
| Vert drapeau foncé (hover) | `bg-bf-green-dark` | `#00703a` |
| Texte principal | `text-zinc-900` | — |
| Texte secondaire | `text-zinc-500` / `text-zinc-600` | — |
| Surfaces | `bg-white` | — |
| Bordures / séparateurs | `border-zinc-200`, `border-zinc-100` | — |

## 3. Typographie

- Police : Geist (déjà chargée dans `layout.tsx`).
- Titres : `font-extrabold` (`text-2xl`/`text-3xl` pour les pages, `text-xl` pour les sections).
- Libellés : `text-sm font-medium text-zinc-700`.

## 4. Composants partagés (`src/components/ui/`)

- `Button` — variantes : `primary` (action principale, vert), `dark` (CTA secondaire), `outline`, `danger` (suppression), `ghost` (filtres/onglets, avec `active`).
- `Field` / `Input` / `Select` — libellé + champ avec le style standard des formulaires.
- `Card` — panneau blanc `rounded-2xl border-zinc-200`.
- `Badge` — pastille `rounded-full`.
- `Table` + `THead`/`TR`/`TH`/`TD` — tableau admin standard.
- `Logo` / `Wordmark` — identité « FASO★YAAR » (étoile = icône `Star`).

## 5. Icônes par catégorie de produit

| Slug | Icône lucide |
| --- | --- |
| `huiles` | `Droplets` |
| `cereales` | `Wheat` |
| `sucreries` | `Candy` |
| `lait` | `Milk` |
| `boissons` | `CupSoda` |
| `hygiene` | `SprayCan` |
| défaut | `ShoppingCart` |

## 6. Interdits

- Émojis bruts, symboles unicode décoratifs (`★`, `→`, `➕`, `×`, drapeaux).
- Classes CSS répétées à la main : utiliser les composants ci-dessus.
- Chaînes de classes conditionnelles redondantes pour les boutons/filtres.
