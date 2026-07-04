// IMPORT COMPLET (188 monstres du Caveau des Abominations) via la CONSOLE (F12).
// Contourne le conflit hide-npc-names. Ouvre F12 > Console, colle tout, Entrée. Système Nimble actif.
(async () => {
  const rootName = 'Caveau des Abominations (Nimble)';
  // nettoyage d'un import precedent (supprime le dossier, ses sous-dossiers et son contenu)
  const prev = game.folders.find(f => f.type === 'Actor' && f.name === rootName);
  if (prev) await prev.delete({ deleteSubfolders: true, deleteContents: true });

  const root = await Folder.create({ name: rootName, type: 'Actor' });
  const data = await (await fetch('modules/pf2e-to-nimble/conversions/nimble-actors.json')).json();

  // sous-dossiers par niveau Nimble (tries croissant, fractions d'abord)
  const val = l => l.includes('/') ? (+l.split('/')[0]) / (+l.split('/')[1]) : +l;
  const levels = [...new Set(data.map(d => d.system.details.level))].sort((a, b) => val(a) - val(b));
  const sub = {};
  for (const l of levels) sub[l] = (await Folder.create({ name: `Niveau ${l}`, type: 'Actor', folder: root.id })).id;

  for (const d of data) d.folder = sub[d.system.details.level];
  const created = await Actor.createDocuments(data);
  ui.notifications.info(`${created.length} monstres importes dans "${rootName}".`);
  console.log(`${created.length} monstres, ${levels.length} niveaux.`);
})();
