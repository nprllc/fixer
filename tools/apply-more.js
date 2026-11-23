// Positions recalées (2e lot) : quêtes, méditations, secrets, cash. [ancien nom, x, y, nouveau nom?]
const fs = require("fs"), path = require("path");
const U = [
 ["Shirley : rhum et scooter",854,1594],
 ["Kirk : affiche du Skunk Ape (Skeeter's)",826,1439],
 ["Kirk : effigies dans les arbres",709,1441],
 ["Kyle : McKittrick Farm",565,748],
 ["Billy : Thrillbilly Mud Club",615,654],
 ["Billy : fourrière d'Ambrosia (The Impaler)",801,665],
 ["Andy : Cellerica (Lucia)",936,784,"Andy : sa nouvelle maison (Lucia)"],
 ["Freddie : bunker (à confirmer)",841,552,"Freddie : son domaine (Retest Freddie's Defenses)"],
 ["Défi de pêche de Cal",707,1636],
 ["Leonida State Prison : sortie de Shayna",818,1350,"Sortie de prison de Shayna (Hamlet Correctional Institution)"],
 ["Starlet Motel : personnes disparues (à confirmer)",467,735,"Gellhorn's Missing Tourists : départ"],
 ["Skunk Ape",793,1442,"Skunk Ape (Bigfoot)"],
 ["Méditation : maison de Jason",849,1598],["Méditation : Swamp",711,915],["Méditation : Worn Stone (Camp Moonflower)",659,881],
 ["Méditation : Red Rocks",580,585],["Méditation : Water Wheel",688,364],["Méditation : Jutting Cliff",784,391],
 ["Méditation : Waterfall",857,344],["Méditation : Ascent (sommet)",748,466],
 ["Colis perdus de Donnie",759,1574],["Lames du plancher de Jason",849,1598]
];
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let hit = 0;
for(const f of ["build-pois.js","argent.js"]){
  const p = path.join(__dirname, f); let s = fs.readFileSync(p, "utf8");
  for(const [n,x,y,nn] of U){
    const re = new RegExp(`(\\["[a-z]+",)"${esc(n)}",\\d+,\\d+,([^\\n]*?),1(,|\\])`);
    if(re.test(s)){ s = s.replace(re, (m,a,mid,end) => `${a}${JSON.stringify(nn||n)},${x},${y},${mid},0${end}`); hit++; }
  }
  fs.writeFileSync(p, s);
}
console.log("mis à jour :", hit, "/", U.length);
