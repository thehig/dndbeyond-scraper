const fs = require("fs-extra");
const path = require("path");

// Turn the scraped data into parsed, usable information
async function main(paramData, options) {
  const {
    SHOW_PROGRESS,
    READ_FROM_CACHE,
    parser: { VERBOSE_PARSING },
    output: { CACHE_DATA_DIR }
  } = options;
  // SHOW_PROGRESS && process.stdout.write("\n");
  SHOW_PROGRESS && console.log(`[ ] Parser`);

  let data = paramData;
  if (READ_FROM_CACHE) {
    SHOW_PROGRESS && console.log(`[ ]      READ_FROM_CACHE Ignoring paramData`);
    const filesInCacheDir = await fs.readdir(CACHE_DATA_DIR);

    data = await Promise.all(
      filesInCacheDir
        .filter(f => f.toLocaleLowerCase().endsWith("json"))
        .map(
          async filename =>
            await fs.readJSON(path.join(CACHE_DATA_DIR, filename))
        )
    );
  } // READ_FROM_CACHE

  data.map(({ name, url, json }) => {
    console.log(`${name} -- ${url}`);
    const jsonData = JSON.parse(json);

    console.log("Keys:");
    Object.keys(jsonData).map(topKey => {
      Object.keys(jsonData[topKey]).map(midKey => {
        console.log(`   ${topKey}.${midKey}`);
      });
    });
  });

  // SCOTTS GIST:       https://gist.github.com/TheHandsomeCoder/9ce9facf5ad4be6e3589755e08311025
  //
  // //Create set of spells by ID for quick compare
  // const mySpellSet = new Set(octaviansSpells.map(s => s.id));

  // //Helper methods, could just include Ramda
  // const sum = (a, c) => a + c;
  // const sumPagesUsed = (a, c) => a + c.definition.level;
  // const spellCost = (isNecromancy, spellLevel) => isNecromancy ? (spellLevel * 50) / 2 : spellLevel * 50
  // const spellTime = (isNecromancy, spellLevel) => isNecromancy ? (spellLevel * 2) / 2 : spellLevel * 2

  // const newSpells = zotrisSpells
  //     .filter(s => !mySpellSet.has(s.id)) //Find spells octavian doesn't have
  //     .filter(s => s.definition.level !== 0) // Can't learn cantrips so filter them
  //     .map(s => ({
  //         name: s.definition.name,
  //         school: s.definition.school,
  //         level: s.definition.level,
  //         cost: spellCost(s.definition.school === 'Necromancy', s.definition.level),
  //         time: spellTime(s.definition.school === 'Necromancy', s.definition.level)
  //     })); //Map only useful info for now

  // const totalCost = newSpells.map(s => s.cost).reduce(sum);
  // const totalTime = newSpells.map(s => s.time).reduce(sum);
}

module.exports = main;
