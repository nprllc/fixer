import cv2, numpy as np
SP="/private/tmp/claude-501/-Users-nicolasprouillac-Library-Application-Support-Claude-scratch-workspaces-419eb9e3-aac3-475f-9fb4-10b5d8f1f524-f6aa336c-bc3d-4291-b3bf-e20e5156e29a-scratch-2026-11-23-e0e306/9a1b05df-931a-4028-a9b6-a48d0f21697c/scratchpad"
P=cv2.imread(SP+"/map/leonida.jpg").astype(np.int16)
b,g,r=P[...,0],P[...,1],P[...,2]
mx=P.max(axis=2); mn=P.min(axis=2); mean=P.mean(axis=2)
H,W=b.shape
WATER,LAND,FOREST,URBAN,SAND,ROAD=1,2,3,4,5,6
cls=np.full((H,W),LAND,np.uint8)
cls[(g>r+10)&(mean<110)]=FOREST
cls[(mx-mn<38)&(mean>140)&(mean<228)]=URBAN
cls[(r>b+18)&(r>150)&(g>140)]=SAND
cls[((b-r)>55)&(b>140)&(g>110)]=WATER
white=(mn>222)
# 1) zone utile : cadre, légende, sceau -> eau
S=W/1461
poly=np.array([[360,62],[1398,62],[1398,1540],[985,1540],[985,1935],[62,1935],[62,400],[360,400]],np.float32)*S
keep=np.zeros((H,W),np.uint8); cv2.fillPoly(keep,[poly.astype(np.int32)],1)
# 2) texte blanc : petites composantes compactes
n,lab,st,_=cv2.connectedComponentsWithStats(white.astype(np.uint8),8)
text=np.zeros((H,W),bool)
for i in range(1,n):
  x,y,w,h,a=st[i]
  m=max(w,h); asp=min(w,h)/max(w,h)
  if m<90 and asp>0.22 and a<2500: text[lab==i]=True

import json
pois=json.load(open("/Users/nicolasprouillac/Library/Application Support/Claude/scratch-workspaces/419eb9e3-aac3-475f-9fb4-10b5d8f1f524/f6aa336c-bc3d-4291-b3bf-e20e5156e29a/scratch-2026-11-23-e0e306/app/pois.json"))
two={"Port Gellhorn","Waning Sands","Watson Bay","Mile Zero Air Station","Wild Hog Point","Wild Hog Airfield","Saint Attaway Islands","Frampton Islands","Little Hardin Island","Richard Barebone State Park","Manifest Canyon","Emerald Springs","Buckskin Swamp","South Kelly County","West Vice-Dale County","Washington Island","Rialto Islands","Casanova Island","Catalan Island","Vespucci Island","Starfish Island","Oldby Island","Tequesta Retreat","Gloriana Key","Catalan Key","Corsair Key","Shoeless Keys","Pelican Valley","Bobcat Key","Hamlet Correctional Institution","Boone Speedway","Tiff Power Station","Peacock Estates","Courtland Park","South Vice-Dale","Paradise RV Park","Henry J Edwards Airport","Big Pine","Sahara Network Data Center","North Leonard County","South Leonard County","North Kelly County","South West Lummox County","East Lummox County","Mount Haines Country Club","Tallaloko Lakeside Resort","Father Scrumpy's Apple Orchard","Ambrosia Raceway Park","Ambrosia Rodeo Association","Thrillbilly Mud Club","Evergreen Mall","Howe Dairy","Tucker's Citrus Farms","Allied Crystal","Chateau Cellerica","Gellhorn Raceway","Leonida State Prison","Salton Memorial Island","Vice City Oceanarium","MacAlister Gold Mine","Sabal Palms"}
lab=np.zeros((H,W),np.uint8)
extra=[("Atlantic Ocean",1275,636,""),("Okchiloha Bay",637,258,""),("Moreau River",820,291,""),("Partridge Bay",922,232,""),("San Malo Bay",484,428,""),("Millport Basin",1080,453,""),("Bobcat Bight",404,1185,""),("Tom Bay",503,1262,""),("Leonida Bay",549,1521,""),("Gambit Bay",820,1573,""),("Peregrine Bay",935,1472,""),("Catalan Bay",1215,1152,""),("Nehrling River",556,1108,""),("Lake Leonida",884,627,""),("Leonida Straits",435,1876,"")]
items=[(p["n"],p["x"]/S,p["y"]/S,p.get("k","")) for p in pois if p["t"]=="lieu"]+extra
for n,x,y,k in items:
  n=n.replace(" (aéroport)","")
  if k=="r": cw,hh=19.5,40
  elif k=="v": cw,hh=13.5,26
  else: cw,hh=7.2,15
  if n in two:
    words=n.split(); half=(len(words)+1)//2
    L=max(len(" ".join(words[:half])),len(" ".join(words[half:]))); hh*=2.05
  else: L=len(n)
  w=L*cw+10; x0,y0=int((x-w/2)*S),int((y-hh/2)*S); x1,y1=int((x+w/2)*S),int((y+hh/2)*S)
  cv2.rectangle(lab,(x0,y0),(x1,y1),1,-1)
cv2.circle(lab,(int(243*S),int(1402*S)),int(62*S),1,-1)
# routes : on garde seulement les grosses composantes (réseau), on retire les blancs dans les étiquettes
road=white&~text&(lab==0)
cls[road]=ROAD
textish=(white|(mean<95)).astype(np.uint8)
textish=cv2.dilate(textish,np.ones((5,5),np.uint8)).astype(bool)
shield=(((r>160)&(g<100)&(b<110))|((b>110)&(r<90)&(g<120)&(b-r>60)&(g<b-40))).astype(np.uint8)
n2,l2,st2,_=cv2.connectedComponentsWithStats(shield,8)
sh=np.zeros((H,W),np.uint8)
for i in range(1,n2):
  x,y,w,h,a=st2[i]
  if a>40 and max(w,h)<120: cv2.rectangle(sh,(x-10,y-10),(x+w+10,y+h+12),1,-1)
unknown=text|((lab==1)&(textish|(cls==SAND)))|(sh==1)
# lettres sombres / contours de texte : on les absorbe par filtre médian plus bas
# 3) remplissage des pixels inconnus par la classe la plus proche
cls[unknown]=0
def fill(c, holes):
  c=c.copy(); U=holes.copy(); c[U]=0
  k=np.ones((3,3),np.float32); it=0
  while U.any() and it<300:
    it+=1
    best=np.zeros(c.shape,np.float32); arg=np.zeros(c.shape,np.uint8)
    for v in (1,2,3,4,5):
      cnt=cv2.filter2D((c==v).astype(np.float32),-1,k)
      m=cnt>best; best[m]=cnt[m]; arg[m]=v
    d=U&(best>0)
    if not d.any(): break
    c[d]=arg[d]; U&=~d
  c[U]=2
  return c
cls=fill(cls,unknown)
# nettoyage : médian sur les classes de fond (routes mises de côté puis remises)
isroad=(cls==ROAD)
base=fill(cls,isroad)
base=cv2.medianBlur(base,5)
# petites îles de bruit
cls=base.copy(); cls[isroad]=ROAD
cls[keep==0]=WATER
np.save(SP+"/vec/cls_clean.npy",cls)
pal=np.array([[0,0,0],[201,173,1],[140,154,87],[90,120,60],[184,178,161],[156,185,191],[255,255,255]],np.uint8)
cv2.imwrite(SP+"/vec/clean.png",cv2.resize(pal[cls],None,fx=0.35,fy=0.35,interpolation=cv2.INTER_NEAREST))
cv2.imwrite(SP+"/vec/clean_vc.png",pal[cls][1600:2400,1600:2500])
print("ok")
