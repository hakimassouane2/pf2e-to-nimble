# IN_PROGRESS — état exact de la réflexion (maj 2026-07-03)

Point de reprise. Plan détaillé : `SPEC.md`. Règles de conversion : `CONVERSION_RULES.md`.

## Phase actuelle
Livrable **(A) bestiaire converti à la main** choisi. **Test de 5 monstres réalisé** (v0.1 du
moteur). En attente de la **validation utilisateur** sur le rendu Foundry + les règles de jugement.

## Décisions actées ✅
1. Conversion 100 % déterministe, zéro IA à l'exécution.
2. Pivot CR : `PF2e niveau → CR → ligne Nimble via colonne "CR Equiv"` (⚠️ Monster Level ≠ CR).
   Sub-1 : `PF2e -1 → CR 0`, `PF2e 0 → CR 1/4`, `PF2e ≥1 → CR = niveau`.
3. Capacités : garder les signatures ; attaque avec effet greffé → dégâts réduits.
4. Livrable = **(A)** conversion manuelle assistée par règles → compendium prêt à l'emploi.

## 🌟 Découverte clé
Le module installé `pf2e-abomination-vaults` contient **les vraies stats PF2e des 188 créatures
d'AV** (schéma PF2e, dans un doc "adventure" en LevelDB). Source **locale, structurée, sans
hallucination**. Extraction possible via `classic-level` (cf. scripts scratchpad).

## Faits techniques établis ✅
- Table Nimble transcrite (`SPEC.md` §5), confirmée par le compendium `monsters`.
- Modèle Nimble : acteur `npc` ; armure `none/medium/heavy` → choisit la colonne PV ; 4 saves
  (FOR/DEX/INT/VOL) ; capacités = `monsterFeature` (texte HTML + `activation.effects` structuré
  optionnel : damage + on.hit conditions → auto-roll).
- Vocabulaire Nimble : dégâts `piercing/slashing/bludgeoning/acid/lightning/necrotic/poison/psychic` ;
  conditions on-hit `grappled/poisoned/restrained/prone/dazed/blinded/hampered/silenced`.

## Livrables du test (dans `conversions/`)
- `nimble-actors.json` — 5 acteurs Nimble (Mitflit, Ghoul, Giant Scorpion, Zebub, Will-o'-Wisp).
- `import-macro.js` — macro Foundry (type script) qui crée les 5 dans un dossier « PF2e→Nimble (démo) ».
- `PREVIEW.md` — aperçu lisible de chaque conversion.

## 🔴 EN ATTENTE — validation utilisateur
1. Lancer la macro dans Foundry → vérifier que les 5 s'importent/s'affichent bien (moi je ne peux
   pas piloter Foundry).
2. Valider/ajuster les règles de jugement v0.1 :
   - **Saves relatifs ±2** (les monstres Nimble livrés utilisent 0) — garder ou mettre 0 ?
   - **Filtre des capacités** (redondance Ghoul : Paralysie sur l'attaque ET en capacité séparée).
   - **Palier d'armure/PV** (via CA vs médiane) — forcer `none` partout ou affiner ?
   - **Départage CR→ligne** (ligne basse par défaut).

## Itérations de feedback réalisées
- Round 1 : images token/portrait distinctes, condition `paralyzed` (au lieu de restrained),
  vitesse relative.
- Round 2 : **méthode C** pour les effets greffés (attaque mentionne, capacité explique, pas
  d'auto-condition) ; **vitesse structurée** `system.attributes.movement`; **Perception retirée**;
  **afflictions résumées** (feature, DC Nimble, sans stades/enfeebled) ; **subtype** action/feature
  (passifs → feature).
- Import : passer par la **console (F12)** `conversions/import-console.js` — la macro plante à cause
  d'un conflit du module `hide-npc-names` (token orphelin sur la scène).

## 🌟 Découverte — importateur natif Nimble
Le système Nimble expose `importMonster` + `rk` (toActorData) qui construit un acteur depuis un
**bloc de stats structuré** (`attributes.movement[]`, `saves`, `size`, `bloodied`, `lastStand`,
`legendary`→type `soloMonster`, `paperforgeImageUrl`…). Piste à évaluer : produire ce bloc et
laisser Nimble construire l'acteur, plutôt que rétro-concevoir le schéma. A révélé le champ
`system.attributes.movement = {walk,fly,swim,climb,burrow}`.

## Ensuite (après validation)
- Généraliser à tout le bestiaire AV (option A à l'échelle) ou packager le moteur (`conversions/`)
  proprement dans le module.
- Note : rien n'est encore commité côté ce test (SPEC/IN_PROGRESS l'étaient au commit `cd10a14`).
