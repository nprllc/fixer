const fs=require("fs"); const f=__dirname+"/../app/index.html"; let h=fs.readFileSync(f,"utf8");
const once=(a,b)=>{ if(h.split(a).length!==2) throw new Error("ancre introuvable/multiple: "+a.slice(0,60)); h=h.replace(a,b); };
const leaflet=fs.readFileSync(__dirname+"/leaflet.min.css","utf8").replace(/\/\*[\s\S]*?\*\//g,"").trim();
const mcss=fs.readFileSync(__dirname+"/map.css","utf8");
once("</style>", "\n/* Leaflet 1.9.4 (BSD-2), feuille de style intégrée */\n"+leaflet+"\n"+mcss+"</style>");
once(`      <div id="cards"></div>
    </div>
  </section>
</main>`, `      <div id="cards"></div>
    </div>
  </section>
  <section class="view" id="v-map" hidden>
    <div id="lmap" role="application" aria-label="Carte de Leonida"></div>
    <div class="mtop">
      <div class="msearch"><input id="mq" type="search" placeholder="Chercher un lieu : Key Lento, OVNI, méditation…" aria-label="Chercher sur la carte" autocomplete="off"></div>
      <div id="mres" hidden></div>
      <div id="mfilters"></div>
    </div>
    <div class="mctl"><button type="button" id="mfit" aria-label="Voir toute la carte" title="Toute la carte">⤢</button></div>
    <div class="mnote" id="mnote" hidden></div>
    <div id="mcard" hidden></div>
  </section>
</main>`);
once(`<button type="button" data-v="guide"><span class="ic">Guide</span>Fiches</button>`,
     `<button type="button" data-v="guide"><span class="ic">Guide</span>Fiches</button>\n  <button type="button" data-v="map"><span class="ic">Carte</span>Leonida</button>`);
once(`["chat","prog","guide"].forEach(`, `["chat","prog","guide","map"].forEach(`);
once(`  if(v==="guide"){ renderCats(); renderCards(); }\n`, `  if(v==="guide"){ renderCats(); renderCards(); }\n  if(v==="map") openMap();\n`);
once(`function refreshViews(){ chips(); if(!history.length) welcome(); if(view==="prog") renderProg(); if(view==="guide") renderCards(); }`,
     `function refreshViews(){ chips(); if(!history.length) welcome(); if(view==="prog") renderProg(); if(view==="guide") renderCards(); if(lmap) drawPins(); }`);
// données
once(`  fetch("missions.json").then(r => r.json()).catch(() => [])
]).then(([k, m]) => {
  KB = k; MISSIONS = m; buildIndex();`, `  fetch("missions.json").then(r => r.json()).catch(() => []),
  fetch("pois.json").then(r => r.json()).catch(() => [])
]).then(([k, m, p]) => {
  KB = k; MISSIONS = m; POIS = p; buildIndex();`);
once(`let KB = [], MISSIONS = [],`, `let POIS = [], KB = [], MISSIONS = [],`);
// outil pour le chat
once(`  { name:"missions_du_chapitre",`, `  { name:"carte", description:"Cherche un lieu ou un point d'intérêt sur la carte officielle de Leonida (poster Rockstar quadrillé A–M / 1–9). Renvoie le nom, la case du quadrillage, le type, le chapitre et si l'emplacement est approximatif. Utilise-le dès que Nico demande où se trouve quelque chose.",
    inputSchema:{type:"object",properties:{lieu:{type:"string",description:"nom du lieu ou de la chose cherchée"}},required:["lieu"]},
    execute: ({lieu}) => { const r = mapSearch(lieu).slice(0,5).map(p => ({nom:p.n, case:p.g, type:TYPES[p.t].n, chapitre:p.ch||"tous", approximatif:!!p.a, au_dela_de_ta_progression:(p.ch||0) > prog(), fiche:p.f||null})); return r.length ? r : {resultat:"pas sur la carte du Fixer"}; } },
  { name:"missions_du_chapitre",`);
once(`- Mets en **gras** les noms`, `- Lieux : appelle l'outil carte et donne la case du quadrillage (ex. « case K6 ») ; Nico peut l'ouvrir dans l'onglet Carte. Précise quand l'emplacement est approximatif.
- Mets en **gras** les noms`);
// code carte, avant la navigation
once(`/* ---------- navigation et réglages ---------- */`, fs.readFileSync(__dirname+"/map.js","utf8")+`\n/* ---------- navigation et réglages ---------- */`);
fs.writeFileSync(f,h); console.log("ok", h.length);
