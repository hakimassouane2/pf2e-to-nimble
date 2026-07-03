# pf2e-to-nimble — Spécifications (document de travail)

> Statut : **BROUILLON / en discussion**. Les sections 🟢 sont tranchées, 🟡 provisoires, 🔴 ouvertes.

## 1. Objectif
Module Foundry VTT convertissant des monstres **Pathfinder 2** en créatures **Nimble** (système
`nimble` v0.8.x). Périmètre prioritaire : bestiaire du **Caveau des Abominations** (fini).

## 2. Priorités utilisateur (ordre)
1. **Fiabilité** — zéro hallucination ; toutes les données nécessaires présentes en entrée.
2. **Praticité** — le moins contraignant possible côté humain.

## 3. 🟢 Architecture — conversion déterministe
Conversion **100 % déterministe en JS, aucune IA à l'exécution**. Le jugement (IA + humain) se fait
au **temps de conception** (maintenant) et est **figé en données/règles**. À l'exécution : simple
lecture → reproductible, auditable, sans hallucination.

## 4. 🟢 Mécanisme de conversion — pivot par le CR
Nimble a une **table de création de monstres** indexée par « Monster Level », avec une colonne
**« CR Equiv »**. ⚠️ **Monster Level ≠ CR** (niveau 20 Nimble = CR 14). Chaîne correcte :

```
PF2e niveau N  →  CR 5e ≈ N (1:1 par défaut, offset réglable)  →  ligne Nimble où CR Equiv = ce CR
→  on lit HP / Damage / Attack / Save DC de cette ligne
```

Les **chiffres** viennent de la table Nimble (source canonique), PAS d'une mise à l'échelle des
chiffres PF2e. Table dérivée/recoupée avec le compendium `monsters` livré (données confirmées OK).

🔴 Points à trancher :
- Mapping PF2e niveau → CR (défaut 1:1).
- Départage quand un CR correspond à 2 lignes Nimble (défaut : ligne basse ; ligne haute si boss/élite).

## 5. 🟢 Table de création de monstres Nimble (transcrite du livre)
Colonnes : Monster Level | HP No Armor | HP M(edium) Armor | HP H(eavy) Armor | Damage/round |
Attack Sample Dice | Save DC | CR Equiv.

| Lvl | HP none | HP med | HP heavy | Dmg | Attaque (gros / 2×) | DC | CR |
|-----|-----|-----|-----|-----|---------------------|----|----|
| 1/4 | 12 | 9 | 7 | 3 | 1d4+1 | 9 | 1/8 |
| 1/3 | 15 | 11 | 8 | 5 | 1d6+2 | 9 | 1/4 |
| 1/2 | 18 | 15 | 11 | 7 | 1d6+3 | 10 | 1/4 |
| 1 | 26 | 20 | 16 | 11 | 2d8+2 / (2×) 1d8+1 | 10 | 1/2 |
| 2 | 34 | 27 | 20 | 13 | 2d8+4 / (2×) 1d8+3 | 11 | 1 |
| 3 | 41 | 33 | 25 | 15 | 2d8+6 / (2×) 1d8+4 | 11 | 1 |
| 4 | 49 | 39 | 29 | 18 | 2d8+9 / (2×) 1d8+5 | 12 | 2 |
| 5 | 58 | 46 | 35 | 19 | 2d8+10 / (2×) 1d8+6 | 12 | 2 |
| 6 | 68 | 54 | 41 | 21 | 2d8+12 / (2×) 1d8+7 | 13 | 3 |
| 7 | 79 | 63 | 47 | 24 | 3d8+10 / (2×) 2d8+4 | 13 | 3 |
| 8 | 91 | 73 | 55 | 26 | 3d8+12 / (2×) 2d8+5 | 14 | 4 |
| 9 | 104 | 83 | 62 | 28 | 4d8+10 / (2×) 2d8+6 | 14 | 4 |
| 10 | 118 | 94 | 71 | 30 | 4d8+12 / (2×) 2d8+7 | 15 | 5 |
| 11 | 133 | 106 | 80 | 33 | 5d8+11 / (2×) 3d8+3 | 15 | 6 |
| 12 | 149 | 119 | 89 | 35 | 5d8+13 / (2×) 3d8+4 | 16 | 7 |
| 13 | 166 | 132 | 100 | 38 | 6d8+11 / (2×) 3d8+6 | 16 | 8 |
| 14 | 184 | 147 | 110 | 40 | 6d8+13 / (2×) 3d8+7 | 17 | 9 |
| 15 | 203 | 162 | 122 | 43 | 7d8+11 / (2×) 3d8+8 | 17 | 9 |
| 16 | 223 | 178 | 134 | 45 | 7d8+13 / (2×) 4d8+5 | 18 | 10 |
| 17 | 244 | 195 | 146 | 48 | 8d8+12 / (2×) 4d8+6 | 18 | 11 |
| 18 | 266 | 213 | 160 | 50 | 8d8+14 / (2×) 4d8+7 | 19 | 12 |
| 19 | 289 | 231 | 173 | 52 | 9d8+12 / (2×) 4d8+8 | 19 | 13 |
| 20 | 313 | 250 | 189 | 54 | 9d8+13 / (2×) 4d8+9 | 20 | 14 |

**Taille de dé (thématique, dégâts/round constants)** : d4 = morts-vivants (lents, gros bonus) ;
d6 = gobelins (chaotiques, ratent/critent) ; **d8 = défaut** (humains, fiable) ; d10 = bêtes ;
d12 = géants ; d20 = créatures les plus puissantes (dégâts massifs).

## 6. 🟢 Modèle de données Nimble (extrait du compendium `monsters` via LevelDB)
- Acteur monstre : type **`npc`** ; sbires : type **`minion`**.
- `system.details.level` : chaîne (ex. `"1"`, `"1/4"`). `system.details.creatureType`, `isFlunky`.
- `system.attributes.armor` : **`none` | `medium` | `heavy`** → sélectionne la colonne PV de la table.
- `system.attributes.hp` : `{max, value, temp}`. `sizeCategory` : `small`/`medium`/…
- `system.attributes.damageResistances / damageVulnerabilities / damageImmunities` : tableaux.
- `system.savingThrows` : **4 saves** — `strength`, `dexterity`, `intelligence`, `will`
  (`{mod, defaultRollMode}`). ⚠️ pas les 6 caractéristiques D&D.
- Capacités = items **`monsterFeature`** : `description` HTML (texte libre, y compris les dégâts),
  `activation` (coût action/réaction, durée, cibles, gabarit), `rules[]` **optionnel** (moteur
  d'effets, ex. `{type:"applyCondition", condition:"despair", trigger:"onCrit"}`), `macro`.
- Constat : sur 217 features, **1 seule** utilise `rules`. Conversion = surtout du texte + quelques
  champs structurés → très tractable et déterministe.

## 7. 🟢 Capacités spéciales — garder les signatures
On **traduit les capacités signature** (identité du monstre), on ignore le bruit mécanique mineur.
DC traduits via la colonne Save DC / table. Filet : l'utilisateur remixe le texte au besoin.

**Règle d'attaque** (idée validée) : budget de dégâts de la table dépensé soit en 1 grosse attaque,
soit en 2× petites. Attaque **simple** → dégâts pleins ; attaque **avec effet greffé** (poison,
agrippe, sort…) → dégâts **réduits** (le reste du budget paie l'effet). Classifiable au temps de
conception (« a un effet non-dégâts ? oui/non »).

## 8. 🟡 Format d'entrée
Voie principale : **données PF2e structurées** (le système PF2e n'est pas installé). Périmètre AV =
ensemble fini → sourcing des stats PF2e des créatures d'AV (Archives of Nethys / pack pf2e AV).
Import JSON en secours pour le homebrew. Texte libre écarté (parsing fragile).

## 9. 🟡 UX / volume
Fenêtre dédiée (recherche → prévisualisation → ajustement → Créer). Unitaire d'abord, batch en v2.

## 10. 🔴 DÉCISION EN ATTENTE — nature du livrable
- (A) **Bestiaire converti** : je convertis à la main les monstres d'AV (selon ces règles) → compendium
  Nimble prêt à l'emploi. Fiabilité max, peu de code. Recommandé vu le périmètre fini.
- (B) **Outil réutilisable** : moteur déterministe + UI, pour n'importe quel monstre PF2e futur.
- (C) **Hybride** : moteur pour les chiffres + données curées pour les capacités d'AV.

## 11. Chantiers restants
- [ ] Décider (A/B/C) §10.
- [ ] Sourcer les stats PF2e des créatures du Caveau des Abominations.
- [ ] Mapping saves PF2e (6) → Nimble (4) : Fort/Ref/Will + attaques → STR/DEX/INT/WIL.
- [ ] Mapping résistances/immunités/types de dégâts PF2e → Nimble.
- [ ] Mapping taille PF2e → sizeCategory ; type de créature.
- [ ] Départage CR→ligne + offset PF2e→CR.
- [ ] Gestion des boss (compendium `legendaryMonsters`, à explorer si besoin).

## 12. Hors périmètre
IA à l'exécution ; conversion PJ/objets/sorts hors monstre ; entrée texte libre.
