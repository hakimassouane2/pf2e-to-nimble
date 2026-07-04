# Règles de conversion PF2e → Nimble (v0.1)

Jeu de règles **déterministe** appliqué par le moteur (`conversions/`). Aucune IA à l'exécution.
Toutes les valeurs chiffrées proviennent de la **table de création de monstres Nimble** (voir
`SPEC.md` §5) via le pivot CR. Les données source PF2e sont lues localement depuis le pack
`pf2e-abomination-vaults` (acteurs de schéma PF2e).

## 1. Niveau PF2e → CR → niveau Nimble
- `PF2e -1 → CR 0` · `PF2e 0 → CR 1/4` · `PF2e N≥1 → CR N` (offset réglable).
- CR → niveau Nimble via la colonne **CR Equiv** de la table. Quand un CR correspond à 2 lignes
  (ex. CR 3 = niveau 6 ou 7), on prend la **ligne basse** par défaut (🟡 réglable ; ligne haute
  pour un boss/élite).
- CR 0 (sous le plancher de la table) → niveau Nimble **1/4**.

## 2. Points de vie & armure
- L'armure Nimble (`none`/`medium`/`heavy`) **choisit la colonne PV** de la table.
- Palier déduit de la **CA PF2e comparée à la CA médiane de son niveau** (calculée sur tout le
  bestiaire AV) : `Δ = CA − médiane` → `Δ ≥ +4 : heavy` · `Δ ≥ +2 : medium` · sinon `none`.
- Défaut `none` (comme la majorité des monstres Nimble livrés). 🟡 à valider.

## 3. Dégâts & attaques
- Profils issus de la ligne Nimble : **1re formule** (grosse) OU **2e formule** (plus basse, "2×").
- **Attaque normale** (dégâts seuls) : **1re formule** (grosse).
- **Attaque spéciale** (applique une **condition simple** : agrippe, poison, paralysie…) :
  **2e formule** (plus basse, non doublée) et la condition est **appliquée automatiquement, sans
  jet de sauvegarde** (règle Nimble : éviter les JDS sauf nécessité ; la perte de dégâts paie
  l'effet gratuit). La condition est encodée en `activation.effects.on.hit`.
- **Grosse affliction** (maladie/malédiction, `isBigAffliction`) : l'attaque reste **normale**
  (grosse formule) et l'affliction est gérée par un **jet de sauvegarde** dans une capacité dédiée.
  Poisons simples/temporaires → condition auto (pas de capacité séparée).
- Jusqu'à **2 strikes** convertis (options d'attaque ; le monstre en utilise une par tour).
- **Taille de dé thématique** (moyenne de dégâts/round conservée) : mort-vivant `d4`,
  gobelin/gremlin `d6`, humanoïde/défaut `d8`, animal/bête `d10`, géant `d12`.
  Re-skin : `bonus' = bonus + n·(moyenne_dé_base - moyenne_dé_cible)`. (Validé sur le Ghoul Nimble
  livré : 1d8+3 → 1d4+5.)
- Dégâts encodés en **effet structuré** (`activation.effects: damage`) → auto-roll dans Foundry.

## 3bis. Français, types de dégâts, icônes
- FR via le module **pf2-fr** (Babele "vf") : noms de monstres, noms/descriptions de capacités par
  **_id** (les _id d'AV correspondent au compendium pf2e), fallback par **nom** via le glossaire de
  capacités SRD. Références Foundry nettoyées (`@Check[will|dc:x]` → « Volonté », etc.).
- **Types de dégâts** en FR depuis la localisation Nimble (lightning → Foudre, piercing → Perforant…).
  Défenses (immunités/résistances/faiblesses) traduites aussi.
- **Icônes** : 100% `.webp` core Foundry (aucune `icons/svg`), mapping par mot-clé (`ICON_MAPPING.md`).
- **Jamais d'em dash** dans le texte généré.

## 4. Sauvegardes
- Save DC (que les joueurs affrontent) = colonne **Save DC** de la table, injecté dans le texte
  des capacités à effet.
- Saves propres du monstre (FOR/DEX/INT/VOL) : **mods relatifs** ±2 déduits des saves PF2e
  (Fort→FOR, Réf→DEX, Vol→VOL et INT), comparés à la moyenne de la créature. 🟡 à valider (les
  monstres Nimble livrés utilisent 0).

## 5. Capacités (garder les signatures)
- **Attaques** : dérivées des strikes (voir §3).
- **Actions/réactions signature** conservées et traduites (texte). Le « bruit » est ignoré :
  compétences/sens/social (`Empathy`, `Lore`, `Tremorsense`, `Darkvision`, `Telepathy`, etc.).
- **Sorts** : seuls les sorts marquants sont gardés (mobilité/contrôle/dégâts :
  Dimension Door, Invisibilité, Bane, Peur, Invocation…) ; les sorts utilitaires sont ignorés.

## 5bis. Type de capacité (`monsterFeature.subtype`)
- **`action`** : attaques et capacités **actives** (coût d'action) ou réactions.
- **`feature`** : traits/règles **passifs** (déduits de `actionType: passive` côté PF2e), afflictions,
  bloc « Défenses », liste de sorts. → une capacité passive comme *Paralysis* est une **feature**,
  pas une action.

## 5ter. Afflictions (poison / maladie) — résumé simple
Les afflictions PF2e multi-stades (Saving Throw / Stage 1-3 / *enfeebled*…) sont **résumées** en une
**feature** courte : nom, `(poison|maladie)`, **sauvegarde Nimble** (Fort→Force, Réf→Dextérité,
Vol→Volonté) + **Save DC de la table Nimble** (pas le DC PF2e), et un effet en une phrase. Les stades
et les conditions absentes de Nimble (*enfeebled*) sont **abandonnés**.

## 6. Vitesse, défenses, taille, type
- **Vitesse** : champ structuré `system.attributes.movement = {walk, fly, swim, climb, burrow}`
  (nombres, en cases). Conversion `cases = round(ft × 6/25)` (base PF2e 25 ft = 6 cases). Les modes
  PF2e (`fly/swim/climb/burrow`) sont préservés ; `walk` vaut 0 si la créature n'a pas de marche.
  (Champ confirmé par le constructeur natif Nimble `rk`/`importMonster` — voir `SPEC.md`.)
- Immunités / résistances / faiblesses → capacité **« Défenses »** en texte (les tableaux
  structurés `damage*` restent vides tant que leur schéma d'élément n'est pas confirmé).
- Types de dégâts remappés vers le vocabulaire Nimble (`electricity→lightning`, `mental→psychic`,
  `void→necrotic`, …). Conditions on-hit limitées au vocabulaire confirmé
  (`grappled/poisoned/restrained/prone/…`).
- Taille PF2e → `sizeCategory` Nimble. `creatureType` conservé. Vitesse convertie en **cases**
  (1 case = 5 ft) et mise dans la description.

## Points ouverts (🟡 à valider avec l'utilisateur)
Palier d'armure · mods de save relatifs · départage CR→ligne · filtre de « bruit » des capacités ·
types de dégâts absents du set Nimble observé (fire/cold/holy…) · redondance possible quand un
effet greffé est aussi décrit comme capacité séparée (ex. Ghoul : Paralysie).
