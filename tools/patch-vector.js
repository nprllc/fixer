const fs=require("fs"), f=process.argv[2]; let h=fs.readFileSync(f,"utf8");
const rep=(a,b)=>{ if(h.split(a).length!==2) throw new Error("ancre ("+h.split(a).length+"): "+a.slice(0,70)); h=h.replace(a,b); };
const i=h.indexOf("/* Tuiles dessinées dans le téléphone"), j=h.indexOf("function initMap(){");
h=h.slice(0,i)+`/* Fond de carte vectoriel maison (basemap.json) : côtes, terre, forêts, villes, plages, routes,
   vectorisés depuis la géographie officielle de Leonida. Dessiné en tuiles dans le téléphone : net à tous les zooms. */
let BASE = null, baseLayer = null;
const BCOL = {water:"#86cde0", land:"#bcdcab", forest:"#97c48d", urban:"#e2e6e9", sand:"#f3e7bf", road:"#ffffff", casing:"#b9c3ca", coast:"#6db8cc"};
function loadBase(){
  if(BASE) return Promise.resolve(BASE);
  return fetch("basemap.json").then(r => r.json()).then(b => { BASE = b; if(baseLayer) baseLayer.redraw(); return b; }).catch(() => null);
}
const VectorLayer = () => L.GridLayer.extend({
  createTile(c){
    const tile = document.createElement("canvas"), dpr = Math.min(window.devicePixelRatio || 1, 2), T = 256;
    tile.width = tile.height = T * dpr;
    if(!BASE) return tile;
    const s = Math.pow(2, c.z), sx = c.x * T / s, sy = c.y * T / s, sw = T / s, k = tile.width / sw;
    const CE = BASE.cell, UP = BASE.up, ctx = tile.getContext("2d");
    const gx0 = Math.max(0, Math.floor((sx - 4) / CE)), gx1 = Math.floor((sx + sw + 4) / CE);
    const gy0 = Math.max(0, Math.floor((sy - 4) / CE)), gy1 = Math.floor((sy + sw + 4) / CE);
    const cells = [];
    for(let gy = gy0; gy <= gy1; gy++) for(let gx = gx0; gx <= gx1; gx++){ const cl = BASE.cells[gx + "," + gy]; if(cl) cells.push([gx, gy, cl]); }
    if(!cells.length) return tile;
    const paint = (li, fill, stroke, lw) => {
      for(const [gx, gy, cl] of cells){
        const rings = cl[li]; if(!rings || !rings.length) continue;
        ctx.setTransform(k / UP, 0, 0, k / UP, (gx * CE - sx) * k, (gy * CE - sy) * k);
        ctx.beginPath();
        for(const r of rings){ ctx.moveTo(r[0], r[1]); for(let q = 2; q < r.length; q += 2) ctx.lineTo(r[q], r[q+1]); ctx.closePath(); }
        if(fill){ ctx.fillStyle = fill; ctx.fill("evenodd"); }
        if(stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw * UP / k * dpr; ctx.stroke(); }
      }
    };
    ctx.lineJoin = "round";
    paint(0, BCOL.land, BCOL.coast, .9);
    paint(1, BCOL.forest, null);
    paint(3, BCOL.sand, null);
    paint(2, BCOL.urban, null);
    if(s > .3) paint(4, null, BCOL.casing, 1.6);
    paint(4, BCOL.road, null);
    return tile;
  }
});
/* Noms de lieux : comtés de loin, villes ensuite, quartiers et îles en zoomant. */
let labelLayer = null;
function buildLabels(){
  labelLayer = L.layerGroup().addTo(lmap);
  for(const p of POIS.filter(p => p.t==="lieu")){
    const cls = p.k==="r" ? "lr" : p.k==="v" ? "lv" : "ln";
    L.marker(ll(p), {interactive:false, keyboard:false, icon:L.divIcon({className:"maplabel " + cls, html:"<span>" + esc(p.n.replace(" (aéroport)","")) + "</span>", iconSize:[0,0]})}).addTo(labelLayer);
  }
}

`+h.slice(j);
rep(`  loadPoster();
  posterLayer = new (PosterLayer())({tileSize:256, minZoom:-6, maxZoom:4, bounds:L.latLngBounds(bounds), keepBuffer:4, updateWhenZooming:false, updateWhenIdle:false, noWrap:true, attribution:"Carte © Rockstar Games"}).addTo(lmap);
  const fit = () => { lmap.invalidateSize(); lmap.setMinZoom(-8); lmap.fitBounds(bounds, {animate:false}); fitZoom = lmap.getZoom(); lmap.setMinZoom(fitZoom - .4); lmap.setMaxZoom(3.5); tier(); };
  const tier = () => { const z = lmap.getZoom() - fitZoom, el = $("#lmap"); el.classList.toggle("z1", z < .7); el.classList.toggle("z2", z >= .7 && z < 1.5); };`,
`  loadBase();
  baseLayer = new (VectorLayer())({tileSize:256, minZoom:-6, maxZoom:6, bounds:L.latLngBounds(bounds), keepBuffer:6, updateWhenZooming:false, updateWhenIdle:false, noWrap:true, attribution:"Géographie : carte officielle de Leonida (Rockstar Games)"}).addTo(lmap);
  const island = [[-3606, 309], [-337, 2486]];
  const fit = () => { lmap.invalidateSize(); lmap.setMinZoom(-8); lmap.fitBounds(island, {animate:false, padding:[8,8]}); fitZoom = lmap.getZoom(); lmap.setMinZoom(fitZoom - .6); lmap.setMaxZoom(fitZoom + 6); tier(); };
  const tier = () => { const z = lmap.getZoom() - fitZoom, el = $("#lmap"); el.classList.toggle("z1", z < .7); el.classList.toggle("z2", z >= .7 && z < 1.5); el.classList.toggle("zl1", z >= .9); el.classList.toggle("zl2", z >= 1.9); };`);
rep(`  buildMarkers(); placeHome();`, `  buildLabels(); buildMarkers(); placeHome();`);
rep(`#lmap{position:absolute;inset:0;background:#01aac9}`, `#lmap{position:absolute;inset:0;background:#86cde0}
.maplabel{pointer-events:none}
.maplabel span{position:absolute;transform:translate(-50%,-50%);white-space:nowrap;color:#29414c;font-weight:700;letter-spacing:.02em;text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 2px #fff;display:none}
.maplabel.lr span{display:block;font-family:var(--display);font-size:20px;letter-spacing:.12em;color:#3d5560;opacity:.75;font-weight:400}
.maplabel.lv span{font-size:12.5px;text-transform:uppercase;letter-spacing:.06em}
.maplabel.ln span{font-size:10.5px;font-weight:600;color:#40565f}
#lmap.zl1 .maplabel.lv span{display:block}
#lmap.zl2 .maplabel.ln span{display:block}
#lmap.zl2 .maplabel.lr span{display:none}`);
// la carte n'a plus d'image externe : plus de message d'erreur ni d'attribution poster
fs.writeFileSync(f,h);
new Function(h.slice(h.lastIndexOf("<script>")+8,h.lastIndexOf("</script>"))); console.log("OK");
