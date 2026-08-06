# FASOYAAR

Localisateur de sites de vente au Burkina Faso — trouvez le magasin le plus proche de chez vous et ouvrez l'itinéraire directement dans Google Maps.

## Stack

- **Next.js 16** (App Router, Server Actions, Turbopack)
- **Prisma + PostgreSQL** (Vercel Postgres / Neon, offres gratuites)
- **Tailwind CSS 4** — identité visuelle aux couleurs du drapeau burkinabè (voir `DESIGN.md`)

## Développement local

1. Crée une base PostgreSQL gratuite ([Neon](https://neon.tech) ou **Vercel Postgres**).
2. Copie `.env.example` en `.env` et renseigne `DATABASE_URL_UNPOOLED` (fourni par l'intégration Neon), `ADMIN_CODE` et `SESSION_SECRET` :
   ```bash
   cp .env.example .env
   npx prisma db push   # crée les tables (City, Store)
   npm run db:seed      # villes + sites de vente de démonstration
   ```
3. Lance :
   ```bash
   npm install
   npm run dev
   ```
   Ouvre http://localhost:3000.

> `ADMIN_CODE` est le code de connexion à l'espace admin (`/admin`). `SESSION_SECRET` se génère avec `openssl rand -hex 32`.

## Déploiement gratuit sur Vercel

Le repo est prêt : chaque modification poussée sur GitHub redéploie automatiquement.

1. **Pousse le code sur GitHub** (déjà fait) puis importe le repo dans [Vercel](https://vercel.com/new) :
   - Framework : **Next.js** (détecté automatiquement).
   - Build : `npm run build` (Prisma est généré au `npm install` via `postinstall`).

2. **Crée la base de données** :
   - Dans Vercel : **Storage → Create Database → Neon** (gratuit). Vercel injecte automatiquement `DATABASE_URL_POOLED` (connexion pooled, adaptée au serverless).

3. **Variables d'environnement** dans **Project → Settings → Environment Variables** :
   | Variable | Valeur |
   | --- | --- |
   | `DATABASE_URL_UNPOOLED` | URL PostgreSQL (créée automatiquement par l'intégration Neon) |
   | `ADMIN_CODE` | ton code admin (≠ celui du `.env` local) |
   | `SESSION_SECRET` | `openssl rand -hex 32` |

4. **Initialise la base une seule fois** (depuis ta machine, avec le `DATABASE_URL_UNPOOLED` de prod dans `.env`) :
   ```bash
   npx prisma db push
   npm run db:seed
   ```

5. **Déploie** : Vercel construit et met en ligne. L'URL est `https://<projet>.vercel.app`.

### Pour modifier ensuite

- Code : `git push` → Vercel redéploie.
- Schéma de base : change `prisma/schema.prisma`, puis `npx prisma db push` (les données sont conservées).

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` | build de production |
| `npm run lint` | eslint |
| `npm run db:push` | synchronise le schéma Prisma avec la base |
| `npm run db:seed` | villes + sites de démonstration |
