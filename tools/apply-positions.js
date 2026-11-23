// Applique les positions recalées (captures de la carte en jeu superposées au poster officiel)
// aux bijouteries, prêteurs, banques, receleurs et à 5 planques de Vice City.
// Usage : node tools/apply-positions.js <dossier contenant chain.json>
const fs = require("fs"), path = require("path");
const chain = JSON.parse(fs.readFileSync(path.join(process.argv[2], "chain.json")));
const C = n => chain[n].slice(0, 2);
const ARG = path.join(__dirname, "argent.js");

const stores = [
 ["The Siren's Chest","j",[773,1703],"1 000–10 000 $"],["Timeless Peculiars","p",[609,1396],"4 500–12 000 $"],["Victoria Lee Jeweler","j",C("Victoria Lee Jeweler"),"9 000–20 000 $"],
 ["Hamlet Pawn","p",[832,1414],"4 500–12 000 $"],["Joyería Empeños","p",[907,1281],"4 500–12 000 $"],["Ernesto's Pawn","p",[916,1268],"4 500–12 000 $"],
 ["Donovan Banks & Co.","j",[959,1240],"14 000–25 000 $"],["Plush","j",C("Plush"),"9 000–20 000 $"],["Pawn City","p",[936,1130],"1 000–10 000 $"],
 ["Icegem Diamonds & Watches","j",C("Icegem Diamonds & Watches"),"14 000–25 000 $"],["Richardson Jewelry & Diamonds","j",C("Richardson Jewelry & Diamonds"),"4 500–12 000 $"],
 ["All That Glitters","j",C("All That Glitters"),"9 000–20 000 $"],["Peacock","j",C("Peacock"),"9 000–20 000 $"],["Fast Cash","p",[959,1052],"1 000–10 000 $"],
 ["The Jewelry Place","j",[809,1001],"1 000–10 000 $"],["Crown Jewels","j",[805,1005],"1 000–10 000 $"],["Dorado Pawn Shop","p",[959,1005],"4 500–12 000 $"],
 ["White Sands Jewelry Pawn","p",[960,967],"4 500–12 000 $"],["Down Town Pawn","p",C("Down Town Pawn"),"1 000–10 000 $"],["Vice City Pawn","p",C("Vice City Pawn"),"4 500–12 000 $"],
 ["Pawn Stash","p",C("Pawn Stash"),"4 500–12 000 $"],["Blanc & Giroux","j",C("Blanc & Giroux"),"14 000–25 000 $"],["Roval Jewelry","j",C("Roval Jewelry"),"14 000–25 000 $"],
 ["Covgari","j",C("Covgari"),"14 000–25 000 $"],["Akoya Jewelers","j",C("Akoya Jewelers"),"14 000–25 000 $"],["Marshal's","j",C("Marshal's"),"9 000–20 000 $"],
 ["Casa de Empeño","p",C("Casa De Empeno"),"4 500–12 000 $"],["Rococo Rich","j",C("Rococo Rich"),"14 000–25 000 $"],["Legendary Custom Jewelry","j",C("Legendary Custom Jewelry"),"14 000–25 000 $"],
 ["Brilliant Cuts","j",[955,796],"9 000–20 000 $"],["Skala","j",C("Skala"),"14 000–25 000 $"],["Kowalski","j",C("Kowalski"),"14 000–25 000 $"],
 ["Buck's Jewelry & Pawn","p",[459,771],"1 000–10 000 $"],["Avery Pawn","p",[467,694],"1 000–10 000 $"],["Florence & Co.","p",[809,635],"4 500–12 000 $"]];
const banks = [
 ["Fleeca Key Lento",[815,1655],"5 000–20 000 $",0],["Shorefront Watson Bay",[590,1380],"5 000–20 000 $",0],["Gibson Brothers Bank",[417,1067],"10 000–30 000 $",0],
 ["Lombank Peacock Bay",[948,1242],"5 000–20 000 $",0],["Fleeca Peacock Bay",[953,1233],"5 000–20 000 $",0],["Shorefront Downtown",C("Shorefront Downtown"),"5 000–15 000 $",0],
 ["Shorefront Rockridge",[943,993],"5 000–20 000 $",0],["Lombank Bayside",C("Lombank Bayside"),"15 000–45 000 $",0],["Fleeca Washington Beach",C("Fleeca Washington Beach"),"10 000–30 000 $",0],
 ["Lombank Ocean Beach (agence)",C("Lombank Ocean Beach (petite)"),"15 000–45 000 $",0],["Fleeca Ocean Beach (agence)",C("Fleeca Ocean Beach (petite)"),"5 000–15 000 $",0],
 ["Shorefront Ocean Beach (agence)",C("Shorefront Ocean Beach (petite)"),"5 000–15 000 $",0],["Druthers State Bank",[940,803],"15 000–45 000 $",0],["Shorefront Ambrosia",[809,653],"5 000–15 000 $",0],
 ["Coffre Fleeca VCIA",[907,1116],"100 000–150 000 $",1],["Coffre Fleeca Tequesta",[983,1188],"65 000–110 000 $",1],["Coffre Lombank Downtown",C("Coffre Lombank Downtown"),"135 000–205 000 $",1],
 ["Coffre Fleeca Downtown",C("Coffre Fleeca Downtown"),"100 000–150 000 $",1],["Coffre Lombank Ocean Beach (le gros)",C("Coffre Lombank Ocean Beach (gros)"),"135 000–205 000 $",1],
 ["Coffre Fleeca Ocean Beach",C("Coffre Fleeca Ocean Beach"),"75 000–135 000 $",1],["Coffre Lombank Ocean Beach (2e)",C("Coffre Lombank Ocean Beach (2e)"),"75 000–135 000 $",1],
 ["Coffre Shorefront Ocean Beach",C("Coffre Shorefront Ocean Beach"),"95 000–140 000 $",1]];
const q = s => JSON.stringify(s);
const lines = [];
for(const [n,k,[x,y],v] of stores) lines.push(` ["bijou",${q((k==="p"?"Prêteur : ":"Bijouterie : ")+n)},${x},${y},${k==="p"?2:3},"braquages",${q(k==="p"?"Prêteur sur gages, braquable (smash 'n' grab) dès Coffee Break (ch.2). Rachète aussi les cartes en double.":"Bijouterie, braquable après les Jewelry Jobs de Yasmani (ch.3). Revends les bijoux à Yasmani, il paie le mieux.")},0,${q(v)}],`);
for(const [n,[x,y],v,vault] of banks) lines.push(` ["banque",${q(n)},${x},${y},${vault?4:3},"braquages",${q(vault?"Grand coffre. Débloqué par « That's Where The Money Is… » (Yasmani, ch.4, après VCIA Takedown). Suis le fourgon blindé jusqu'à la banque. 4 étoiles automatiques.":"Petite agence : tiroir-caisse + coffre. Braquable après Credit Check (ch.3).")},0,${q(v)}],`);

let src = fs.readFileSync(ARG, "utf8").split("\n");
src = src.filter(l => !/^ \["(banque|bijou)"/.test(l) && !/^   \["/.test(l) && !/^ \/\/ ---- (Banques|Bijouteries et prêteurs)/.test(l));
const i = src.findIndex(l => l.includes("// ---- Receleurs"));
src.splice(i, 0, " // ---- Bijouteries, prêteurs et banques : positions recalées sur les captures de la carte en jeu", ...lines);
let s = src.join("\n");
const fen = {"Brian (le Lockup)":[763,1692],"Donnie (sa caravane)":[820,1644],"Dunk":[463,704],"Tyrone":C("Tyrone"),"Yasmani":[950,1062],"Moses (voitures)":[459,740],"Randy (voitures de luxe)":[824,989]};
const gang = {"Ocean Beach Lab":C("Ocean Beach Lab"),"Vespucci Mansion":C("Vespucci Mansion"),"Chatfield Storage & Logistics":C("Chatfield Storage & Logistics"),"San4San : Sound4Sound Studio":C("San4San : Sound4Sound Studio"),"San4San : La Perle Trap House":C("San4San : La Perle Trap House")};
let hit = 0;
for(const [t, map] of [["receleur", fen], ["gang", gang]]) for(const [n, [x, y]] of Object.entries(map)){
  const re = new RegExp(`(\\["${t}","${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}",)\\d+,\\d+,([^,]+,"[^"]*","[^"]*"),1,`);
  if(re.test(s)){ s = s.replace(re, `$1${x},${y},$2,0,`); hit++; } else console.log("absent :", n);
}
fs.writeFileSync(ARG, s);
console.log(lines.length, "établissements, mis à jour :", hit);
