# Mapping d'icônes (attaques & capacités)

Attribution **déterministe** d'une icône core Foundry (`icons/…`, ~6200 `.webp`, aucune `svg`) à
chaque `monsterFeature`, à partir de mots-clés. Objectif : rendu joli et cohérent, proche de ce que
D&D 5e / Nimble font (l'exactitude sémantique passe après le fait que « ça rende bien »).

## Principe
- Liste ordonnée `ICONS = [regex, [icônes…]]`. Le **premier motif qui matche** gagne.
- **Priorité** : type d'**arme/attaque nommée** (crossbow, sword, bite, claw, sting, tentacle…)
  AVANT les **types de dégâts** (fire, cold, lightning, acid…) AVANT les **effets/conditions**
  (paralysie, peur, poison…) AVANT le **générique** (sort, aura). Évite le bug « arbalète de poison »
  (une arbalète empoisonnée doit prendre l'icône d'arbalète, pas de fiole de poison).
- **Variété** : chaque motif pointe vers **plusieurs** icônes ; on en choisit une par **hash
  (nom du monstre + nom de la capacité)**. Résultat varié d'un monstre à l'autre mais **reproductible**
  (deux conversions identiques donnent le même choix). Ex. 3 monstres avec « Mandibules » obtiennent
  3 icônes de morsure différentes.
- **Recherche** : pour une attaque, on teste `"<nom d'attaque anglais> <type de dégâts>"`. Le type de
  dégâts n'est ajouté **que s'il est élémentaire** (feu, foudre, acide, poison, nécrotique…), jamais
  physique : « slashing » contient « lash », « bludgeoning » contient « bludgeon », ce qui créait des
  faux positifs (griffe → fléau, vrille → gourdin).

## Couverture (mots-clés → catégorie d'icônes)
- **Armes** : crossbow, bow, gun, dart/thrown, greatsword, scimitar, sword, dagger, axe, hammer,
  mace, flail/whip, club, polearm (glaive/halberd/spear/lance/pike/trident), staff, wand, fist.
- **Attaques naturelles** : bite/jaws/fang/beak, venom, claw/talon, sting/pincer, tentacle/tendril,
  tail, gaze/eye, spider/web, swarm.
- **Types de dégâts** : fire, cold, lightning/thunder, acid, necrotic/void/drain, psychic/mental,
  radiant/holy/light.
- **Conditions/effets** : paralysie/pétrification, peur, charme/hypnose, sommeil, confusion,
  étourdissement, maladie, à terre, agrippe/entrave, malédiction.
- **Capacités/sorts** : téléportation, invisibilité, ombre, soin/régénération, défense/bouclier,
  réaction/riposte, invocation, bond/déplacement, aura/rage, sort/magie générique.
- Mots-clés en **anglais ET français** (les noms d'attaque sont matchés en anglais, mais les
  synonymes FR sont là par sécurité).

## Défauts
- Attaque sans correspondance → une épée (3 variantes).
- Capacité passive sans correspondance → un livre (3 variantes).

## Étendre / ajuster
Éditer la liste `ICONS` dans le moteur (`convert.mjs`) : ajouter `[/motif/i, ['icons/…', 'icons/…']]`
en tête pour prioriser, ou ajouter des icônes à une liste existante pour plus de variété. Vérifier
que chaque chemin existe sous `resources/app/public/icons/` (le moteur peut être relancé avec un
contrôle d'existence). La **planche-contact** (artifact) reste utile pour comparer visuellement des
icônes candidates avant de les ajouter.
