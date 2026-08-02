<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:fasoyaar-design-rules -->
# Design system (FASOYAAR)

Avant d'écrire ou de modifier toute interface, lis `DESIGN.md` (racine du projet) et applique-le :

1. **Zéro émoji brut** : uniquement des icônes SVG de `lucide-react`.
2. **Composants réutilisables** : `src/components/ui/` (Button, Field, Input, Select, Card, Badge, Table, Logo, CategoryIcon). Ne recrée jamais du CSS dupliqué à la main.
3. **Surfaces plates et épurées** : blanc, bordures `zinc-200`, `rounded-2xl`, pas d'ombres lourdes.
<!-- END:fasoyaar-design-rules -->
