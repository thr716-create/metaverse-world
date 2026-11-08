(()=>{
 const wait=()=>{if(!window.MVEditor||!window.MVEditor.scene){setTimeout(wait,150);return;}init()};
 function init(){const M=window.MVEditor,T=M.THREE,scene=M.scene;const toast=m=>{const e=document.querySelector('#toast');e.textContent=m;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2300)};
 const floors=[0,4,8];let currentFloor=0,building=null,wallMat=new T.MeshStandardMaterial({color:0xd8d5ca,roughness:.85}),floorMat=new T.MeshStandardMaterial({color:0x92785f,roughness:.8}),trim=new T.MeshStandardMaterial({color:0x526a76,metalness:.25,roughness:.4});
 function cube(parent,w,h,d,mat,x,y,z){const o=new T.Mesh(new T.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
 function makeBuilding(){if(building)scene.remove(building);building=new T.Group();building.name='MV9-MULTIFLOOR-HOME';for(let f=0;f<3;f++){let y=f*4;cube(building,14,.25,12,floorMat,0,y,0);cube(building,14,.25,.22,wallMat,0,y+1.7,-6);cube(building,14,.25,.22,wallMat,0,y+1.7,6);cube(building,.22,3.4,12,wallMat,-7,y+1.7,0);cube(building,.22,3.4,12,wallMat,7,y+1.7,0);cube(building,2.4,.08,2.4,trim,-4,y+.2,-3);cube(building,2.4,.08,2.4,trim,4,y+.2,3);const tag=document.createElement('canvas');tag.width=256;tag.height=64;const c=tag.getContext('2d');c.fillStyle='#102333';c.fillRect(0,0,256,64);c.fillStyle='white';c.font='bold 28px sans-serif';c.fillText(['1F · 거실','2F · 침실','3F · 루프탑'][f],12,42);const tx=new T.CanvasTexture(tag),sp=new T.Sprite(new T.SpriteMaterial({map:tx}));sp.scale.set(5,1.25,1);sp.position.set(0,y+2.8,-5.7);building.add(sp);
 // stair flights and landings are visible architectural geometry
 for(let n=0;n<8;n++)cube(building,2.1,.18,.55,trim,-4.7+n*.24,y+.25+n*.22,3.4-n*.42);
 cube(building,3,.18,2.4,trim,-3.8,y+1.85,0);
 }
 // elevator shaft with three floor call panels
 cube(building,2.4,12,.22,trim,4.7,6,0);cube(building,.22,12,2.4,trim,3.5,6,0);cube(building,2.2,11.8,2.2,new T.MeshStandardMaterial({color:0x80b6c1,transparent:true,opacity:.16}),4.7,6,0);
 for(let f=0;f<3;f++){const btn=cube(building,.34,.34,.12,new T.MeshStandardMaterial({color:0x45d8c7,emissive:0x167b72}),5.8,f*4+.7,1.35);btn.userData.floor=f;}
 building.position.set(0,0,-115);scene.add(building);return building;}
 makeBuilding();
 const panel=document.createElement('div');panel.id='mv9-controls';panel.style.cssText='position:fixed;left:12px;bottom:14px;z-index:1001;background:#0b1a2beF;color:#eef6ff;border:1px solid #5b7d8c;border-radius:13px;padding:10px;max-width:min(360px,calc(100vw - 24px));font:12px system-ui;pointer-events:auto';panel.innerHTML='<b>🏢 9.0 건물·생활 편집</b><div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:7px"><button data-floor="0">1층</button><button data-floor="1">2층</button><button data-floor="2">3층</button><button id="mv9-elevator">🛗 엘리베이터</button><button id="mv9-home">🏠 집 위치로</button><button id="mv9-design">🎨 외관 변경</button><button id="mv9-save">☁ 저장</button></div><small id="mv9-status">도시 북쪽의 개인 3층 주택 · 층 이동은 버튼으로 가능</small>';document.body.append(panel);const style=document.createElement('style');style.textContent='#mv9-controls button{background:#23566b;color:white;border:1px solid #6f9bab;border-radius:7px;padding:8px 10px;min-height:38px}';document.head.append(style);
 function setFloor(f){currentFloor=f;window.MVFloorY=floors[f];M.setPlayer(0,-115);M.setFloor(floors[f]);toast((f+1)+'층으로 이동했습니다');document.querySelector('#mv9-status').textContent=(f+1)+'층 · '+['거실','침실','루프탑'][f]+' · 엘리베이터 또는 층 버튼으로 이동';}
 panel.querySelectorAll('[data-floor]').forEach(b=>b.onclick=()=>setFloor(Number(b.dataset.floor)));panel.querySelector('#mv9-elevator').onclick=()=>setFloor((currentFloor+1)%3);panel.querySelector('#mv9-home').onclick=()=>setFloor(0);
 panel.querySelector('#mv9-design').onclick=()=>{const colors=['#d8d5ca','#b8c9d2','#d5b28c','#8cae9c','#596b85'];const color=colors[(Math.floor(Math.random()*colors.length))];wallMat.color.set(color);toast('주택 외벽 색상을 변경했습니다. 저장을 눌러 적용하세요.');};
 panel.querySelector('#mv9-save').onclick=async()=>{try{const a=JSON.parse(localStorage.getItem('mw-account')||'null');if(!a?.token){toast('계정 로그인 후 저장할 수 있습니다.');return;}const r=await fetch('/api/home-design',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:'Bearer '+a.token},body:JSON.stringify({floor:currentFloor,wallColor:'#'+wallMat.color.getHexString(),floors:3,updatedAt:Date.now()})});if(!r.ok)throw Error((await r.json()).error||'저장 실패');toast('주택 디자인을 서버에 저장했습니다.');}catch(e){toast(e.message)}};
 // A small collision field around city blocks; vehicles bounce/stop before buildings.
 const obstacles=[[-165,-48,10,10],[-143,-48,9,9],[-105,-48,11,11],[-82,-48,9,9],[-165,42,10,10],[-137,42,9,9],[-100,42,11,11],[93,-48,8,8],[120,-48,10,10],[151,-48,8,8],[95,42,9,9],[130,42,8,8],[164,42,8,8]];
 window.MVCollision=(x,z)=>obstacles.some(([cx,cz,w,d])=>Math.abs(x-cx)<w/2+1.5&&Math.abs(z-cz)<d/2+2);
 // Party members' positions are broadcast only to the same room.
 const sock=M.getSocket?.();if(sock){sock.on('party-position',p=>{let el=document.querySelector('#mv9-party-'+p.id);if(!el){el=document.createElement('div');el.id='mv9-party-'+p.id;el.style.cssText='position:fixed;right:12px;top:190px;background:#102b39dd;color:white;padding:5px 8px;border-radius:7px;font:11px system-ui;z-index:1000';document.body.append(el)}el.textContent='파티원 위치 · '+Math.round(p.x)+', '+Math.round(p.z)+' · '+(p.y>6?'3층':p.y>2?'2층':'1층')});sock.on('party-notice',d=>toast(d.name+' 파티 참가'))}
 // Store floor design in the account home record via a dedicated endpoint; allow safe local fallback.
 window.MV9={setFloor,getFloor:()=>currentFloor,building};
 }
 wait();
})();