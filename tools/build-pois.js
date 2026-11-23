// Construit app/pois.json. Coordonnées relevées sur le poster officiel Rockstar
// (affiché en 1461x2000, converties en pixels de l'original 2805x3840).
// Lieux : noms imprimés sur le poster. Points : fiches de la base, placées au lieu nommé
// par les sources texte croisées ; a:1 = emplacement approximatif (zone seulement).
const S = 2805/1461;
const L = s => s.trim().split("\n").map(l => { const [n,x,y,k] = l.split("|").map(v=>v.trim()); return {t:"lieu", n, x:+x, y:+y, k:k||""}; });
const lieux = L(`
Hyde Island|838|229
Saint Attaway Islands|772|262
Bonanza|703|283
Featherstone Islands|555|313
Frampton Islands|940|292
Moreau|752|330
MacAlister Gold Mine|687|341
East Lummox County|930|354
Tallaloko Lakeside Resort|881|366
Lummox County|727|402|r
Grayson|555|436
Mount Kalaga National Park|727|452
South West Lummox County|563|478
Millport|962|459
North Leonard County|872|503
Little Hardin Island|1132|495
Richard Barebone State Park|1044|530
Zephyr Islands|364|509
Mount Haines Country Club|971|548
North Kelly County|717|559
Manifest Canyon|569|589
Father Scrumpy's Apple Orchard|510|582
Draper Island|358|598
Ambrosia Raceway Park|790|612
Lake Leonida|884|627
Thrillbilly Mud Club|701|627
Waning Sands|1080|645
Sabal Palms|1028|645
Ambrosia Rodeo Association|771|660
Vinewood Beach|1155|669
Evergreen Mall|1052|690
Frogswater|647|687
Draper Bay|369|688
Port Gellhorn|444|714|v
Ambrosia|810|713|v
Leonard County|1020|718|r
Wild Hog Airfield|388|750
Wild Hog Point|360|778
Howe Dairy|664|752
Tucker's Citrus Farms|697|765
Allied Crystal|802|745
Chateau Cellerica|926|762
Kelly County|617|791|r
Belville|960|791
Sandbars|207|809
Borrachero Sound|330|820
Cellerica|952|814
Leaf Links|1132|835
Emerald Springs|671|840
South Leonard County|886|866
Decor District|1060|866
Washington Island|1212|866
Crude Islands|275|873
Gellhorn Raceway|438|870
Washington Beach|1263|888
Penmarch Isle|1166|885
Gellhorn|514|894
Stockyard|1057|898
Leonida State Prison|588|920
Oldby Island|1221|914
La Perle|993|928
Rialto Islands|1120|935
Casanova Island|1162|946
Bayside|1050|943
Buckskin Swamp|700|945
Catalan Island|1093|962
Fleece Field|928|973
Vespucci Island|1132|970
Crosstown|1020|993
Rockridge|953|996
Balsero|857|999
Salton Memorial Island|1143|995
Vice Beach|1245|978|r
Capri Sound|316|1013
South Kelly County|576|1010
Starfish Island|1148|1028
FLAM|1048|1008
Sahara Arena|1055|1030
Vice City|978|1040|v
Capri|420|1054
Little Cuba|965|1065
Downtown|1025|1069
Ocean Beach|1260|1045
Waxman Island|1127|1065
West Vice-Dale County|651|1072
Salton|908|1081
Belpoint|256|1098
Nehrling River|556|1108
Port Vice City|1177|1112
VCIA (aéroport)|826|1140
Vice-Dale County|1053|1147|r
Catalan Bay|1215|1152
Breakwater Quarry|632|1166
Tequesta|984|1190
Tequesta Retreat|1065|1185
Dalton Island|1265|1190
Bobcat Bight|404|1185
Vice City Oceanarium|1078|1228
Gloriana Key|1163|1250
Big Pine|575|1245
Sahara Network Data Center|686|1243
Bluegrass|819|1266
Peacock Bay|972|1279
Courtland Park|1045|1257
Catalan Key|1062|1284
Gulf of Leonida|190|1277
Bobcat Key|480|1283
Southside|912|1300
Henry J Edwards Airport|503|1316
Grassrivers|657|1326|r
Peacock Estates|965|1320
Paradise RV Park|687|1358
Hamlet Correctional Institution|806|1345
Hamlet|818|1370|v
South Vice-Dale|903|1355
Watson Bay|631|1407
Boone Speedway|802|1395
Tiff Power Station|920|1420
Mariana County|601|1460|r
Pelican Valley|762|1465
Corsair Key|987|1476
Peregrine Bay|935|1472
Leonida Bay|549|1521
Shoeless Keys|884|1516
Cottonmouth Lake|745|1557
Gambit Bay|820|1573
Key Lento|830|1665|v
Riquezas Keys|318|1659
Goose Key|406|1693
Permit Keys|532|1688
Southwind|478|1709
Mile Zero Air Station|403|1739
Maroon Key|657|1720
Abismo Key|656|1785
Leonida Straits|435|1876`);

// [type, nom, x, y, chap, fiche, description courte, approx?]
const P = [
 // Strangers & Freaks
 ["quete","Shirley : rhum et scooter",842,1652,1,"sf-shirley","Départ au magasin d'alcool des Keys. Ratable : perdu après Tourist Trap."],
 ["quete","Kirk : affiche du Skunk Ape (Skeeter's)",828,1384,1,"sf-kirk","Lis l'affiche au Skeeter's bar puis appelle Kirk. Affiche aussi au Rusty Anchor de Key Lento."],
 ["quete","Kirk : effigies dans les arbres",768,1478,1,"sf-kirk","Search for Tree Effigies, à Pelican Valley.",1],
 ["quete","Kenton : boutique de plongée",812,1678,1,"sf-kenton","Icône verte KR sur le front de mer. Rachète les trésors des épaves (33 découvertes)."],
 ["quete","Kyle : McKittrick Farm",500,780,2,"sf-kyle","Ferme du ch.2, secteur de Port Gellhorn (position exacte à confirmer).",1],
 ["quete","Billy : Thrillbilly Mud Club",706,634,2,"sf-billy","Départ au club. Ne compte pas pour le trophée S&F."],
 ["quete","Billy : fourrière d'Ambrosia (The Impaler)",818,724,2,"sf-billy","Voler la voiture de police à la fourrière.",1],
 ["quete","Andy : Cellerica (Lucia)",948,822,3,"sf-andy","Lucia uniquement. Livraisons et trophée Road to Rehabilitation.",1],
 ["quete","Dodos Rising : manif devant l'Oceanarium",1082,1236,3,"sf-dodos","Point d'interrogation violet. Mission 1 : voler l'orque avec Rosebud."],
 ["quete","Dodos Rising : labo de primates",836,1212,3,"sf-dodos","Au sud de VCIA. Mission 2 : sortir un chimpanzé.",1],
 ["quete","Dodos Rising : fracking de Watson Bay",642,1398,3,"sf-dodos","Mission 3. CHOIX : sauver Steve (conseillé) ou suivre Tyler.",1],
 ["quete","Dodos Rising : zoo d'Emerald Springs",676,848,3,"sf-dodos","Mission 4 : voler l'œuf de dodo.",1],
 ["quete","Dodos Rising : clinique PetPep",428,1062,3,"sf-dodos","Embuscade à Capri : prévois gilet et munitions.",1],
 ["quete","Papa Audacity (à confirmer)",1252,1082,3,"sf-autres","Près du parc au sud d'Ocean Beach. Une seule source.",1],
 ["quete","Dr. Merle : Frank's Waffles (à confirmer)",990,1198,3,"sf-autres","Rendez-vous à Tequesta après l'affiche No Flushers.",1],
 ["quete","Freddie : bunker (à confirmer)",884,590,3,"sf-autres","Au nord du Lake Leonida, par le château d'eau. 10 000 $.",1],
 ["quete","Alien Dreams : installation secrète (à confirmer)",826,1418,2,"sf-autres","Au sud de Hamlet, suite de l'OVNI.",1],
 // Missions annexes et ratables
 ["mission","Ring the Bell! : Rusty Anchor",824,1658,1,"ch1-optionnels","Verre avec Cal. RATABLE avant Swamped. T-shirt et casquette exclusifs."],
 ["mission","Défi de pêche de Cal",814,1580,1,"ch1-optionnels","Poisson-perroquet de plus de 2 livres : trophée Baited My Tackle.",1],
 ["mission","Bateau coulé de Donnie",990,1484,1,"ch1-optionnels","Variante de Find the Lost Drugs après Don Gone.",1],
 ["mission","Gellhorn Outfitters (Pick Up a Gun)",438,722,2,"ch2-optionnels","Se déclenche tout seul au ch.2.",1],
 ["mission","Starlet Motel : personnes disparues (à confirmer)",498,708,2,"ch2-optionnels","Affiches au motel. Quête signalée par une seule source.",1],
 ["mission","Courtyard Bar : rendez-vous en couple",1060,904,4,"ch4-optionnels","« It's a Date! » à Stockyard.",1],
 ["mission","Leonida State Prison : sortie de Shayna",590,926,4,"ch4-optionnels","Lucia : aller chercher Shayna. Limitée dans le temps.",1],
 // Rencontres
 ["rencontre","Lucky Dog : le chien en jet ski",826,1588,1,"re-keys","Nage seul au large 5 min, suis les aboiements. Environ 1 200 $.",1],
 ["rencontre","Vieux marin ivre (Cheeky Mutineer)",836,1648,1,"re-keys","Il demande de l'argent : suis-le jusqu'à l'eau pour le harpon Bullhead.",1],
 ["rencontre","Grand-mère voleuse (quai d'Island Dreams)",818,1670,1,"re-keys","Rattrape-la et rends le portefeuille.",1],
 ["rencontre","Shooting du triton",888,1522,1,"re-keys","Petite île des Shoeless Keys, près du piano.",1],
 ["rencontre","Van coincé avec un tigre",660,1744,1,"re-keys","Au sud de Maroon Key, carrefour du dirigeable.",1],
 ["rencontre","Recrue du M7 (armurerie Big Shots)",812,1362,1,"re-hamlet","Libère la recrue : révèle la planque M7 de la casse Nova Auto.",1],
 ["rencontre","Cris au sud de Hamlet",834,1404,1,"re-hamlet","Entrepôt (fusil Hobo) ou motel avec un tigre.",1],
 ["rencontre","Brique de cocaïne (maison sur pilotis)",690,1300,1,"re-hamlet","Trois hommes te poursuivent en hydroglisseur.",1],
 ["rencontre","Avion écrasé",646,1316,0,"re-partout","Suis la fumée : cocaïne, butin, pistolet lance-fusées.",1],
 ["rencontre","Kidnapping en nageant (non confirmé)",842,236,0,"re-partout","Réveil dans un conteneur : sniper FF-50 et cash.",1],
 ["rencontre","Passager tueur à gages : Harborside Park",1238,1000,3,"re-vicecity","Jason en voiture. Contrat à Harborside Park : cash et 2 étoiles.",1],
 ["rencontre","Le lutteur de la plage",1262,1024,3,"re-vicecity","Jason à pied, de jour : 1 000 $ si tu gagnes.",1],
 ["rencontre","Dépanneur agressé (NE 3rd St)",1030,1140,3,"re-vicecity","Vers 13 h. Libère la Pegassi Tempesta pour Randy.",1],
 ["rencontre","OVNI (près du Starlet Motel)",508,700,2,"re-gellhorn-ambrosia","Vers 2 h du matin, seul. Trophée The Truth Is Out There.",1],
 ["rencontre","Serpent dans le coffre",966,798,2,"re-gellhorn-ambrosia","Voiture noire près d'une maison de Belville. QTE.",1],
 ["rencontre","Yacht à cocaïne (carte dans l'épave)",756,1470,0,"re-supplementaires","Épave d'avion de Pelican Valley : récupère la carte.",1],
 // Secrets
 ["secret","Planeur écrasé",408,1192,0,"secrets","Tire sur le parachute dans les arbres : pistolet Turnt Nipper .38.",1],
 ["secret","Île SOS",560,1418,0,"secrets","À l'ouest de Watson Bay : téléphone près du premier S.",1],
 ["secret","Météorite violette (Table Rock)",764,448,0,"secrets","Versant est du Mount Kalaga, dans les creux rocheux.",1],
 ["secret","Bunker du Mount Kalaga",704,466,0,"secrets","Code sur la tour (signalé 69185), clavier de la cabane.",1],
 ["secret","Maison mystère",956,786,0,"secrets","Belville : porte de garage blanche, deux palmiers.",1],
 ["secret","Œuf de Pâques (tour de communication)",900,1346,0,"secrets","Au sud de Vice-Dale : grimpe, prends l'œuf, lance-le.",1],
 ["secret","Skunk Ape",740,1552,0,"secrets","Marais autour de Cottonmouth Lake, de nuit.",1],
 ["secret","Clin d'œil à Dexter (Trinity Apartments)",1216,874,0,"secrets","Washington Island.",1],
 ["secret","Roman western (Jacob's Tavern)",966,466,0,"secrets","Millport.",1],
 ["secret","Monument of Leonidan Supremacy",574,596,0,"secrets","Manifest Canyon. Mystère non résolu.",1],
 ["secret","Combat contre Satan",448,650,0,"secrets-horreur","Nord de Port Gellhorn, minuit–4 h : le van, puis le feu de camp.",1],
 ["secret","Hôtel Marbelle",1022,1004,0,"secrets-horreur","South Crosstown : entre par l'arrière et monte.",1],
 // Méditation
 ["meditation","Méditation : maison de Jason",846,1684,1,"collectibles-meditation","RATABLE : ch.1 seulement.",1],
 ["meditation","Méditation : Smooth Sand",404,1040,0,"collectibles-meditation","Près de Capri.",1],
 ["meditation","Méditation : Swamp",704,952,0,"collectibles-meditation","Buckskin Swamp.",1],
 ["meditation","Méditation : Worn Stone (Camp Moonflower)",620,880,0,"collectibles-meditation","Kelly County, position du camp à confirmer.",1],
 ["meditation","Méditation : Red Rocks",562,582,0,"collectibles-meditation","Manifest Canyon.",1],
 ["meditation","Méditation : Water Wheel",758,338,0,"collectibles-meditation","Moreau.",1],
 ["meditation","Méditation : Jutting Cliff",716,440,0,"collectibles-meditation","Mount Kalaga.",1],
 ["meditation","Méditation : Waterfall",874,378,0,"collectibles-meditation","Près de Tallaloko.",1],
 ["meditation","Méditation : Ascent (sommet)",740,436,0,"collectibles-meditation","S'ouvre en dernier, demande les deux persos.",1],
 ["meditation","Méditation : Seaside",1090,654,0,"collectibles-meditation","Près de Waning Sands.",1],
 // Activités
 ["activite","Cascade : rivière Nehrling",560,1114,0,"activites","Stunt Spot.",1],
 ["activite","Gellhorn International Raceway",440,876,0,"activites","Circuit, cascades.",1],
 ["activite","Cascade : entrepôt VCIA",862,1126,0,"activites","Stunt Spot.",1],
 ["activite","Cascade : Hamlet Backyard",808,1384,0,"activites","Stunt Spot.",1],
 ["activite","Cascade : pont cassé de North Moreau",752,318,0,"activites","Stunt Spot.",1],
 ["activite","Scan WAiNK : supercars",1258,1050,0,"collectibles-vue","Ocean Beach.",1],
 ["activite","Scan WAiNK : utilitaires",446,734,0,"collectibles-vue","Port Gellhorn.",1],
 ["activite","Scan WAiNK : voitures courantes",830,1672,0,"collectibles-vue","Key Lento.",1],
];
P.push(...require("./argent.js"));
const grid = (x,y) => "ABCDEFGHIJKLM"[Math.max(0,Math.min(12,Math.round((y-107)/151.8)))] + (Math.max(0,Math.min(8,Math.floor((x-47)/151.8)))+1);
const out = [
  ...lieux.map((p,i) => ({id:"l"+i, t:"lieu", n:p.n, k:p.k, x:Math.round(p.x*S), y:Math.round(p.y*S), g:grid(p.x,p.y)})),
  ...P.map(([t,n,x,y,ch,f,d,a,v,li],i) => Object.assign({id:"p"+i, t, n, x:Math.round(x*S), y:Math.round(y*S), g:grid(x,y), ch, f, d, a:a?1:0}, v?{v}:{}, li?{li}:{}))
];
const kb = require("../app/kb.json"); for(const p of out) if(p.f && !kb.find(k=>k.id===p.f)) throw new Error("fiche inconnue "+p.f);
require("fs").writeFileSync(__dirname+"/../app/pois.json", "[\n"+out.map(o=>JSON.stringify(o)).join(",\n")+"\n]\n");
console.log(lieux.length, "lieux,", P.length, "points");
