import cv2, numpy as np, json
SP="/private/tmp/claude-501/-Users-nicolasprouillac-Library-Application-Support-Claude-scratch-workspaces-419eb9e3-aac3-475f-9fb4-10b5d8f1f524-f6aa336c-bc3d-4291-b3bf-e20e5156e29a-scratch-2026-11-23-e0e306/9a1b05df-931a-4028-a9b6-a48d0f21697c/scratchpad"
cls=np.load(SP+"/vec/cls_clean.npy")
H,W=cls.shape
WATER,LAND,FOREST,URBAN,SAND,ROAD=1,2,3,4,5,6
blocks=np.load(SP+"/vec/blocks.npy")
layers=[cls!=WATER, cls==FOREST, cls==URBAN, cls==SAND, cls==ROAD, blocks]
CELL=256; UP=2; EPS=[1.0,1.2,1.0,1.0,0.6,0.8]
out={"cell":CELL,"up":UP,"w":W,"h":H,"cells":{}}
tot=0
for li,m in enumerate(layers):
  m=m.astype(np.float32)
  if li<4 or li==5:
    # ouverture/fermeture légère pour lisser et retirer les miettes
    mu=(m*255).astype(np.uint8)
    mu=cv2.morphologyEx(mu,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    mu=cv2.morphologyEx(mu,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
    m=mu.astype(np.float32)/255
  for cy in range(0,H,CELL):
    for cx in range(0,W,CELL):
      x0,y0=max(0,cx-2),max(0,cy-2); x1,y1=min(W,cx+CELL+2),min(H,cy+CELL+2)
      sub=m[y0:y1,x0:x1]
      if sub.max()==0: continue
      s=cv2.GaussianBlur(sub,(0,0),0.9 if li<4 else 0.6)
      s=cv2.resize(s,None,fx=UP,fy=UP,interpolation=cv2.INTER_LINEAR)
      bw=(s>0.5).astype(np.uint8)
      if bw.max()==0: continue
      cs,_=cv2.findContours(bw,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE)
      rings=[]
      for c in cs:
        if cv2.contourArea(c)< (6 if li in (4,5) else 10)*UP*UP: continue
        a=cv2.approxPolyDP(c,EPS[li]*UP*0.5,True).reshape(-1,2)
        if len(a)<3: continue
        a=a+np.array([(x0-cx)*UP,(y0-cy)*UP])
        rings.append(a.flatten().astype(int).tolist())
      if rings:
        key=f"{cx//CELL},{cy//CELL}"
        out["cells"].setdefault(key,[[],[],[],[],[],[]])[li]=rings
        tot+=sum(len(r)//2 for r in rings)
json.dump(out,open(SP+"/vec/basemap.json","w"),separators=(",",":"))
import os
print("points",tot,"taille",os.path.getsize(SP+"/vec/basemap.json")//1024,"Ko")
