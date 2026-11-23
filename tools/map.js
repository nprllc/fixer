/* ---------- carte ---------- */
/* Fond : le poster officiel « The Great State of Leonida », servi par Rockstar (pas copié ici).
   Coordonnées des points en pixels du poster (2805 x 3840). */
const MAP_IMG = "https://www.rockstargames.com/VI/_next/static/media/Leonida_Map_Poster.08ir77j-.26ny.jpg";
const MAP_W = 2805, MAP_H = 3840;
const TYPES = {
  quete:{n:"Strangers & Freaks", c:"#ff4fa3", i:"?"},
  mission:{n:"Missions annexes", c:"#ffb14a", i:"!"},
  rencontre:{n:"Rencontres", c:"#3ee6e0", i:"✱"},
  secret:{n:"Secrets", c:"#b48cff", i:"◆"},
  meditation:{n:"Méditation", c:"#5be38a", i:"☯"},
  activite:{n:"Activités", c:"#f1eaf7", i:"★"},
  lieu:{n:"Lieux", c:"#ffffff", i:""}
};
let lmap = null, layer = null, lieuLayer = null, selId = null, mapRevealed = new Set();
let mOn = new Set(["quete","mission","rencontre","secret","meditation","activite"]);
try{ const s = store.get("mfilters", null); if(Array.isArray(s)) mOn = new Set(s); }catch(e){}
const ll = p => [-p.y, p.x];
const locked = p => (p.ch||0) > prog() && !mapRevealed.has(p.id);

function mapSearch(q){
  const w = norm(q).split(/\s+/).filter(x => x.length > 1);
  if(!w.length) return [];
  return POIS.map(p => {
    const hay = norm(p.n + " " + (p.d||"") + " " + TYPES[p.t].n);
    const name = norm(p.n);
    let s = 0;
    for(const x of w){ if(name.includes(x)) s += 3; else if(hay.includes(x)) s += 1; else return null; }
    if(name.startsWith(w[0])) s += 2;
    if(p.t==="lieu" && p.k) s += 1;
    return {p, s};
  }).filter(Boolean).sort((a,b) => b.s - a.s).map(r => r.p);
}

function pinIcon(p){
  const t = TYPES[p.t];
  if(p.t==="lieu") return L.divIcon({className:"", html:`<div class="lpin ${p.k?"big":""}"></div>`, iconSize:[16,16], iconAnchor:[8,8]});
  const lk = locked(p);
  return L.divIcon({className:"", iconSize:[22,22], iconAnchor:[11,26],
    html:`<div class="pin ${lk?"lock":""} ${p.id===selId?"sel":""}" style="--c:${t.c}"><i>${lk?"·":t.i}</i></div>`});
}

function drawPins(){
  if(!lmap) return;
  layer.clearLayers(); lieuLayer.clearLayers();
  for(const p of POIS){
    if(p.t==="lieu"){
      if(!mOn.has("lieu") && p.id!==selId) continue;
      L.marker(ll(p), {icon:pinIcon(p), keyboard:false}).on("click", () => select(p)).addTo(lieuLayer);
      continue;
    }
    if(!mOn.has(p.t) && p.id!==selId) continue;
    const m = L.marker(ll(p), {icon:pinIcon(p), title:locked(p) ? "Spoiler" : p.n, riseOnHover:true, zIndexOffset:p.id===selId?1000:0});
    if(!locked(p) && !matchMedia("(hover:none)").matches) m.bindTooltip(p.n, {className:"ptip", direction:"top", offset:[0,-24]});
    m.on("click", () => select(p)).addTo(layer);
  }
}

function renderFilters(){
  const keys = ["quete","mission","rencontre","secret","meditation","activite","lieu"];
  $("#mfilters").innerHTML = keys.map(k => {
    const n = POIS.filter(p => p.t===k).length;
    return `<button type="button" class="chip ${mOn.has(k)?"":"off"}" data-mf="${k}" aria-pressed="${mOn.has(k)}"><span class="dot" style="--c:${TYPES[k].c}"></span>${TYPES[k].n} <small style="color:var(--mut)">${n}</small></button>`;
  }).join("");
}

function select(p, fly){
  selId = p.id;
  const lk = locked(p), t = TYPES[p.t], fiche = p.f ? KB.find(k => k.id===p.f) : null;
  const meta = [`<span class="cell">Case ${p.g}</span>`, esc(t.n)];
  if(p.t!=="lieu") meta.push(p.ch ? "ch." + p.ch : "tout le jeu");
  $("#mcard").innerHTML = `<div class="grab"></div><button type="button" class="x" data-mx aria-label="Fermer">✕</button>
    <h3>${lk ? "Point du chapitre " + p.ch : esc(p.n)}</h3>
    <div class="meta">${meta.join(" · ")}</div>
    ${p.t==="lieu" ? `<p>${p.k==="r" ? "Comté de Leonida." : p.k==="v" ? "Ville." : "Lieu indiqué sur la carte officielle."}</p>` :
      `<p class="${lk?"blur":""}">${esc(lk ? "Contenu masqué pour éviter le spoiler, révèle-le si tu veux." : p.d)}</p>
       ${p.a && !lk ? `<p class="approx">Emplacement approximatif : le point montre la zone. Vérifie la position exacte sur GTABase ou Map Genie.</p>` : ""}`}
    <div class="acts">
      ${lk ? `<button type="button" class="mini" data-mreveal="${p.id}">Afficher quand même</button>` : `
      <button type="button" class="mini on" data-mask="${p.id}">Demander au Fixer</button>
      ${fiche ? `<button type="button" class="mini" data-mfiche="${fiche.id}">Lire la fiche</button>` : ""}
      ${MAPS.map(([n,u]) => `<a class="mini" href="${u}" target="_blank" rel="noopener">${n}</a>`).join("")}`}
    </div>`;
  $("#mcard").hidden = false; $("#mres").hidden = true;
  drawPins();
  if(fly){
    lmap.flyTo(ll(p), Math.max(lmap.getZoom(), 0), {duration:.8});
    const pulse = L.marker(ll(p), {icon:L.divIcon({className:"", html:'<div class="pulse"></div>', iconSize:[60,60], iconAnchor:[30,30]}), interactive:false}).addTo(lmap);
    setTimeout(() => pulse.remove(), 4300);
  }
}
function unselect(){ selId = null; $("#mcard").hidden = true; drawPins(); }

function openMap(){
  if(lmap){ setTimeout(() => lmap.invalidateSize(), 0); return; }
  if(window.L) return initMap();
  $("#mnote").hidden = false; $("#mnote").textContent = "Chargement de la carte…";
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
  s.onload = () => { $("#mnote").hidden = true; initMap(); };
  s.onerror = () => { $("#mnote").textContent = "Impossible de charger le moteur de carte. Vérifie ta connexion."; };
  document.head.appendChild(s);
}

function initMap(){
  const bounds = [[-MAP_H, 0], [0, MAP_W]];
  lmap = L.map("lmap", {crs:L.CRS.Simple, zoomSnap:.25, zoomDelta:.5, wheelPxPerZoomLevel:90, maxBounds:L.latLngBounds(bounds).pad(.15), maxBoundsViscosity:.8, zoomControl:false, attributionControl:true, tap:true});
  lmap.attributionControl.setPrefix(false);
  const img = L.imageOverlay(MAP_IMG, bounds, {attribution:"Carte © Rockstar Games"}).addTo(lmap);
  img.on("error", () => {
    $("#lmap").classList.add("noimg");
    $("#mnote").hidden = false;
    $("#mnote").innerHTML = `La carte officielle ne peut pas s'afficher ici. Les points restent utilisables avec le quadrillage. Version complète : <a href="https://nprllc.github.io/fixer/" target="_blank" rel="noopener">nprllc.github.io/fixer</a>`;
  });
  lieuLayer = L.layerGroup().addTo(lmap);
  layer = L.layerGroup().addTo(lmap);
  lmap.fitBounds(bounds);
  lmap.setMinZoom(lmap.getZoom() - .5); lmap.setMaxZoom(2);
  lmap.on("click", () => { $("#mres").hidden = true; if(selId) unselect(); });
  renderFilters(); drawPins();
}

$("#mfilters").addEventListener("click", e => {
  const b = e.target.closest("[data-mf]"); if(!b) return;
  const k = b.dataset.mf; mOn.has(k) ? mOn.delete(k) : mOn.add(k);
  store.set("mfilters", [...mOn]); renderFilters(); drawPins();
});
$("#mfit").onclick = () => { if(lmap) lmap.flyToBounds([[-MAP_H,0],[0,MAP_W]], {duration:.6}); };
$("#mq").addEventListener("input", () => {
  const r = mapSearch($("#mq").value).slice(0, 8);
  if(!$("#mq").value.trim()){ $("#mres").hidden = true; return; }
  $("#mres").innerHTML = r.length ? r.map(p => `<button type="button" data-mgo="${p.id}"><span class="dot" style="--c:${TYPES[p.t].c}"></span><span>${esc(locked(p) ? "Point du chapitre " + p.ch : p.n)}</span><small>${p.g}</small></button>`).join("")
    : `<div class="empty" style="padding:12px 14px;color:var(--mut)">Rien sur la carte. Demande au Fixer.</div>`;
  $("#mres").hidden = false;
});
$("#mq").addEventListener("keydown", e => { if(e.key==="Enter"){ const b = $("#mres [data-mgo]"); if(b){ b.click(); $("#mq").blur(); } } });
$("#mres").addEventListener("click", e => { const b = e.target.closest("[data-mgo]"); if(!b) return; const p = POIS.find(x => x.id===b.dataset.mgo); $("#mres").hidden = true; select(p, true); });
$("#mcard").addEventListener("click", e => {
  const b = e.target.closest("button"); if(!b) return;
  if("mx" in b.dataset) unselect();
  if(b.dataset.mreveal){ mapRevealed.add(b.dataset.mreveal); select(POIS.find(x => x.id===b.dataset.mreveal)); }
  if(b.dataset.mask){ const p = POIS.find(x => x.id===b.dataset.mask); show("chat"); ask(`Je suis sur la carte, case ${p.g} : « ${p.n} ». Qu'est-ce que je dois savoir et comment je m'y prends ?`); }
  if(b.dataset.mfiche){ const f = KB.find(k => k.id===b.dataset.mfiche); gCat = "Tout"; $("#gq").value = f.titre; show("guide"); }
});
