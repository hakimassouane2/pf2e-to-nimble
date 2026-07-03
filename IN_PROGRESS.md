# IN_PROGRESS — état exact de la réflexion (2026-07-03)

Point de reprise. Le plan détaillé est dans `SPEC.md` ; ce fichier dit **où on en est précisément**
et **ce qui bloque**.

## Phase actuelle
Cadrage du besoin terminé à ~90 %. On a validé l'architecture et le mécanisme de conversion.
**Une seule décision manque** pour passer à la réalisation (voir §« BLOQUÉ SUR »).

## Décisions actées ✅
1. **Conversion 100 % déterministe** en JS, aucune IA à l'exécution (priorité = zéro hallucination).
   Le jugement se fait au temps de conception et se fige en données.
2. **Pivot par le CR** : `PF2e niveau N → CR 5e ≈ N (1:1 par défaut) → ligne de la table Nimble dont
   la colonne "CR Equiv" = ce CR → stats de cette ligne`.
   ⚠️ Piège identifié : *Monster Level Nimble ≠ CR* (niveau 20 = CR 14) → indexer par CR Equiv.
3. **Capacités** : garder les **signatures** (traduites) ; attaque avec effet greffé = dégâts réduits.
4. **Périmètre** : bestiaire du **Caveau des Abominations** (ensemble fini).

## Faits techniques établis (vérifiés sur les données) ✅
- Table de création de monstres Nimble **transcrite** dans `SPEC.md` §5, **confirmée** par le
  compendium `monsters` (ex. Snakeman niveau 1 armure none = 26 PV, exact).
- Système PF2e **non installé** ; modules `pf2e-*` déjà portés Nimble → aucune donnée PF2e brute locale.
- Modèle Nimble : acteur monstre = type **`npc`** (+ `minion`) ; armure = palier `none/medium/heavy`
  qui choisit la colonne PV ; **4 saves** (STR/DEX/INT/WIL) ; capacités = items `monsterFeature`
  (description HTML libre + activation + `rules[]` optionnel, utilisé 1× sur 217).

## 🔴 BLOQUÉ SUR — nature du livrable (réponse attendue : A / B / C)
- **(A) Bestiaire converti** *(reco)* : conversion manuelle des monstres d'AV selon les règles →
  compendium Nimble prêt à l'emploi. Fiabilité max, peu de code.
- **(B) Outil réutilisable** : moteur déterministe + UI, pour tout monstre PF2e futur.
- **(C) Hybride** : moteur pour les chiffres + capacités curées à la main pour AV.

## Prochaine tâche concrète (dès la réponse A/B/C)
Si A ou C : **sourcer les stats PF2e des créatures du Caveau des Abominations** (Archives of Nethys
ou pack PF2e d'AV). → Question ouverte à l'utilisateur : as-tu déjà une source sous la main ?

## Chantiers de conception restants (détail dans SPEC.md §11)
- Mapping saves PF2e (Fort/Ref/Will) → Nimble (STR/DEX/INT/WIL).
- Mapping résistances/immunités/types de dégâts ; taille ; type de créature.
- Règle de départage quand un CR → 2 lignes Nimble ; offset PF2e→CR.
- Boss : explorer le compendium `legendaryMonsters` si besoin.
