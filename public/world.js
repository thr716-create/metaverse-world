import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

// METAVERSE WORLD 2.0 — connected city, nature and future districts
const root = document.querySelector('#game');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9dc7dc);
scene.fog = new THREE.Fog(0x9dc7dc, 100, 390);
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 700);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
root.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xdff3ff, 0x596b53, 2.0));
const sun = new THREE.DirectionalLight(0xfff1d9, 3.0);
sun.position.set(-90, 130, 70); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -220; sun.shadow.camera.right = 220; sun.shadow.camera.top = 220; sun.shadow.camera.bottom = -220;
scene.add(sun);
const mat = (color, roughness=.78, metalness=0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const materials = {
 grass: mat(0x789b79), park: mat(0x8eae8d), road: mat(0x343f49,.95), sidewalk: mat(0xc5ccca), line: mat(0xf1d77c), glass: mat(0x8ec6d8,.22,.35),
 concrete: mat(0x9baab0,.72,.12), white: mat(0xe5e9e7), dark: mat(0x20303b,.45,.3), neon: mat(0x24d9d0,.3,.45), wood: mat(0x70503a)
};
function box(w,h,d,material,x,y,z, parent=scene){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function label(text, color='#ffffff') {
  const c=document.createElement('canvas'); c.width=512; c.height=128; const ctx=c.getContext('2d');
  ctx.fillStyle='rgba(5,17,29,.72)'; ctx.roundRect(8,8,496,112,28); ctx.fill(); ctx.font='bold 42px sans-serif'; ctx.textAlign='center'; ctx.fillStyle=color; ctx.fillText(text,256,79);
  const tex=new THREE.CanvasTexture(c); const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true})); sprite.scale.set(25,6.25,1); return sprite;
}
// Wide continuous terrain, divided into three connected districts.
const terrain=box(390,.8,190,materials.grass,0,-.55,0); terrain.castShadow=false;
// Main connecting boulevard and cross streets.
box(390,.12,15,materials.road,0,.02,0); box(390,.035,.22,materials.line,0,.09,0);
for(let x=-180;x<=180;x+=18){ box(.12,.04,1.4,materials.white,x,.1,0); }
for(const x of [-125,-65,0,65,125]) box(8,.08,190,materials.sidewalk,x,.02,0);
for(const z of [-65,65]) box(390,.12,8,materials.sidewalk,0,.02,z);
// District signposts
const districts=[{name:'MODERN CITY',x:-125,color:'#bdeaff'},{name:'GREEN LIVING',x:0,color:'#d6ffd5'},{name:'NEO FUTURE',x:125,color:'#70fff2'}];
districts.forEach(d=>{const s=label(d.name,d.color);s.position.set(d.x,13,-20);scene.add(s);});
// Urban district: city blocks, storefronts, street trees and lamps.
function tower(x,z,w,h,d,color){const g=new THREE.Group();const body=box(w,h,d,mat(color,.48,.22),0,h/2,0,g);box(w*.84,.28,d*.84,materials.dark,0,h+.14,0,g);
  const floors=Math.floor(h/3.2); for(let f=1;f<floors;f++){for(let xx=-w/2+1.2;xx<w/2-.5;xx+=2.3){box(1.15,1.45,.07,materials.glass,xx,f*3.1,d/2+.04,g);}}
  g.position.set(x,0,z);scene.add(g); return g;}
[[-165,-48,15,34,14,0x8299a8],[-143,-48,13,23,13,0x9aaeb7],[-105,-48,18,43,16,0x607f93],[-82,-48,13,29,13,0x9aa7b1],[-165,42,17,27,15,0x879ba5],[-137,42,14,38,14,0x718b9b],[-100,42,19,31,16,0x8e9fa7]].forEach(a=>tower(...a));
// Shops along city boulevard
for(let i=0;i<5;i++){const x=-170+i*20;const g=new THREE.Group();box(12,5,10,mat(0xd8d8d0),0,2.5,0,g);box(12,1,10,mat([0x2d6570,0x9a6047,0x536d92,0x6d8054,0x755a85][i]),0,5.5,0,g);box(8,2.1,.12,materials.glass,0,2.4,5.08,g);g.position.set(x,0,13);scene.add(g);}
// Park district: lawns, ponds, walking paths and varied trees.
const pond=new THREE.Mesh(new THREE.CircleGeometry(18,48),mat(0x6db9c8,.22,.18));pond.rotation.x=-Math.PI/2;pond.position.set(0,.02,-43);scene.add(pond);
function tree(x,z,s=1){const g=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.22*s,.34*s,2.4*s,9),materials.wood);trunk.position.y=1.2*s;trunk.castShadow=true;g.add(trunk);for(let j=0;j<3;j++){const crown=new THREE.Mesh(new THREE.IcosahedronGeometry((1.05-j*.12)*s,1),mat([0x286c50,0x3e895d,0x347653][j]));crown.position.set((j-1)*.08*s,(2.35+j*.55)*s,0);crown.castShadow=true;g.add(crown);}g.position.set(x,0,z);scene.add(g);}
for(let i=0;i<60;i++){const x=(Math.random()-.5)*115,z=(Math.random()-.5)*145;if(Math.abs(x)<18&&Math.abs(z)<20)continue;tree(x,z,.75+Math.random()*.55);}
// Park pavilion and benches
const gazebo=new THREE.Group();const plinth=new THREE.Mesh(new THREE.CylinderGeometry(8,9,.6,12),materials.white);plinth.position.y=.3;gazebo.add(plinth);const roof=new THREE.Mesh(new THREE.ConeGeometry(9,3.2,8),mat(0x547d69));roof.position.y=5.1;gazebo.add(roof);for(let i=0;i<8;i++){const a=i*Math.PI/4;const p=new THREE.Mesh(new THREE.CylinderGeometry(.18,.22,4.5,8),materials.white);p.position.set(Math.cos(a)*6,2.55,Math.sin(a)*6);gazebo.add(p);}gazebo.position.set(0,0,28);scene.add(gazebo);
for(let x of [-25,-12,12,25]){box(4,.35,1.1,mat(0x805d43),x,.7,8);box(4,.18,.3,mat(0x3b4850),x,.38,8);}
// Future district: sculpted towers, glowing trims and elevated transit guideway.
function futureTower(x,z,r,h,color){const g=new THREE.Group();const base=new THREE.Mesh(new THREE.CylinderGeometry(r*.72,r,h,8),mat(color,.32,.35));base.position.y=h/2;base.castShadow=true;g.add(base);const cap=new THREE.Mesh(new THREE.CylinderGeometry(r*.95,r*.72,2,8),materials.dark);cap.position.y=h+1;g.add(cap);const ring=new THREE.Mesh(new THREE.TorusGeometry(r*.78,.12,8,40),materials.neon);ring.rotation.x=Math.PI/2;ring.position.y=h*.55;g.add(ring);for(let y=4;y<h-2;y+=5){const band=new THREE.Mesh(new THREE.CylinderGeometry(r*1.01,r*1.01,.09,8),materials.neon);band.position.y=y;g.add(band);}g.position.set(x,0,z);scene.add(g);}
futureTower(93,-48,8,42,0x526c85);futureTower(120,-48,11,58,0x354f68);futureTower(151,-48,7,34,0x687c91);futureTower(95,42,10,49,0x4e7183);futureTower(130,42,8,38,0x5e718c);futureTower(164,42,7,29,0x4a6578);
// Elevated transit bridge
box(92,1.1,4,mat(0x344b5b,.35,.5),126,13,0);for(let x of [88,164])box(1.5,13,1.5,materials.dark,x,6.5,0);
// Street lights in city and future districts
for(const x of [-175,-155,-135,-115,-95,85,105,125,145,165]){for(const z of [-12,12]){const pole=new THREE.Group();const stem=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,5,8),materials.dark);stem.position.y=2.5;pole.add(stem);const lamp=new THREE.Mesh(new THREE.SphereGeometry(.35,12,8),mat(0xfff0b0,.25));lamp.position.y=5.1;pole.add(lamp);pole.position.set(x,0,z);scene.add(pole);}}
// Simple parked cars to establish scale and a drivable prototype vehicle.
function makeCar(color=0x2e8d91){const g=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(2.3,.75,4.2),mat(color,.35,.35));body.position.y=.85;body.castShadow=true;g.add(body);const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.65,.8,2),materials.glass);cabin.position.set(0,1.55,-.15);g.add(cabin);for(const x of [-1,1])for(const z of [-1.35,1.35]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.22,16),materials.dark);w.rotation.z=Math.PI/2;w.position.set(x*1.12,.45,z);g.add(w);}return g;}
for(let i=0;i<4;i++){const car=makeCar([0x2c8c91,0xc4a45e,0x9b6470,0x617b9c][i]);car.position.set(-165+i*18,0,5);scene.add(car);}
const myCar=makeCar(0x22b9ae);myCar.visible=false;scene.add(myCar);
// 4.0: walk-in community hub interior (a real separate room in the same world).
const hub=new THREE.Group();
const hubX=-165, hubZ=82;
const hubFloor=box(22,.5,18,mat(0xb8c4c5),0,.0,0,hub);
box(22,5,.5,mat(0xe4e8e5),0,2.5,-9,hub); box(22,5,.5,mat(0xe4e8e5),0,2.5,9,hub);
box(.5,5,18,mat(0xe4e8e5),-11,2.5,0,hub); box(.5,5,18,mat(0xe4e8e5),11,2.5,0,hub);
box(8,.25,3,mat(0x6b8790),-4,1.1,-5,hub); box(8,.25,3,mat(0x6b8790),4,1.1,-5,hub);
box(5,.25,1.4,mat(0x795b43),0,.75,2,hub); box(5,.15,.18,mat(0x303b45),0,.55,2,hub);
for(const x of [-7,7]){const plant=new THREE.Group();const pot=new THREE.Mesh(new THREE.CylinderGeometry(.55,.42,.8,12),mat(0x8a654b));pot.position.y=.4;plant.add(pot);const leaves=new THREE.Mesh(new THREE.IcosahedronGeometry(1.15,1),mat(0x347653));leaves.position.y=1.65;plant.add(leaves);plant.position.set(x,0,5);hub.add(plant);}
hub.position.set(hubX,0,hubZ);scene.add(hub);
const hubSign=label('COMMUNITY HUB','#e7fff9');hubSign.position.set(hubX,7,hubZ-9.4);scene.add(hubSign);
let insideHub=false;
function enterExitHub(){
  if(!insideHub && Math.hypot(me.position.x-(-170),me.position.z-13)<13){insideHub=true;me.position.set(hubX,0,hubZ+5);toast('커뮤니티 허브에 입장했습니다 · E로 나가기');}
  else if(insideHub){insideHub=false;me.position.set(-170,0,20);toast('도시 광장으로 나왔습니다');}
  else toast('건물 입구(현대 도시 상점가) 가까이에서 E를 눌러주세요');
}

// Detailed procedural humanoid avatar with articulated joints and expression-ready face.
function makeAvatar(color=0x5eead4){
  const g=new THREE.Group();
  const skin=mat(0xd7a27f,.82), shirt=mat(color,.58), pants=mat(0x253448,.76), shoe=mat(0x111923,.55), hair=mat(0x171b25,.9), eyeWhite=mat(0xf5f2eb,.35), iris=mat(0x38251d,.3), detail=mat(0x563b32,.8);
  const sphere=(r,seg=18)=>new THREE.SphereGeometry(r,seg,Math.max(12,Math.floor(seg*.7)));
  // Pelvis and tailored torso
  const pelvis=new THREE.Mesh(new THREE.BoxGeometry(.62,.38,.36),pants);pelvis.position.y=.91;g.add(pelvis);
  const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.39,.68,8,16),shirt);torso.position.y=1.48;torso.castShadow=true;g.add(torso);
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(.13,.16,.22,12),skin);neck.position.y=2.02;g.add(neck);
  const collar=new THREE.Mesh(new THREE.TorusGeometry(.19,.045,8,24),mat(0xe9f2ef,.6));collar.rotation.x=Math.PI/2;collar.position.set(0,1.88,.02);g.add(collar);
  // Head, ears, jaw and hair cap
  const head=new THREE.Mesh(new THREE.SphereGeometry(.32,28,22),skin);head.scale.set(1,.99,.93);head.position.set(0,2.35,0);head.castShadow=true;g.add(head);
  for(const side of [-1,1]){const ear=new THREE.Mesh(sphere(.085),skin);ear.position.set(side*.31,2.34,0);ear.scale.set(.62,1,.7);g.add(ear);}
  const hairCap=new THREE.Mesh(new THREE.SphereGeometry(.333,24,16,0,Math.PI*2,0,Math.PI*.57),hair);hairCap.position.set(0,2.43,-.015);g.add(hairCap);
  const fringe=new THREE.Mesh(new THREE.SphereGeometry(.22,18,12,0,Math.PI,0,Math.PI*.55),hair);fringe.scale.set(1,.48,.65);fringe.position.set(0,2.53,.22);g.add(fringe);
  for(const side of [-1,1]){
    const eye=new THREE.Mesh(sphere(.055,14),eyeWhite);eye.position.set(side*.115,2.37,.285);g.add(eye);
    const pupil=new THREE.Mesh(sphere(.027,12),iris);pupil.position.set(side*.115,2.37,.333);g.add(pupil);
    const brow=new THREE.Mesh(new THREE.BoxGeometry(.105,.025,.035),hair);brow.position.set(side*.115,2.455,.29);brow.rotation.z=side*-.08;g.add(brow);
  }
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.045,12,10),skin);nose.scale.set(.7,.8,1.1);nose.position.set(0,2.31,.315);g.add(nose);
  const mouth=new THREE.Mesh(new THREE.BoxGeometry(.105,.018,.018),detail);mouth.position.set(0,2.205,.292);g.add(mouth);
  const ponytail=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.34,6,12),hair);ponytail.position.set(0,2.18,-.27);ponytail.rotation.x=-.18;ponytail.visible=false;g.add(ponytail);
  const longLocks=[];for(const side of [-1,1]){const lock=new THREE.Mesh(new THREE.CapsuleGeometry(.075,.35,6,10),hair);lock.position.set(side*.255,2.22,-.015);lock.rotation.z=side*-.08;lock.visible=false;g.add(lock);longLocks.push(lock);}
  // Articulated arms: shoulder pivots, upper arms, forearms and hands
  const joints={arms:[],legs:[]};
  const glasses=new THREE.Group(); const frameMat=mat(0x202a35,.32,.45);
  for(const side of [-1,1]){const lens=new THREE.Mesh(new THREE.TorusGeometry(.085,.018,7,20),frameMat);lens.position.set(side*.112,2.37,.294);glasses.add(lens);}
  const bridge=new THREE.Mesh(new THREE.BoxGeometry(.07,.018,.025),frameMat);bridge.position.set(0,2.37,.30);glasses.add(bridge); glasses.visible=false; g.add(glasses);
  for(const side of [-1,1]){
    const shoulder=new THREE.Group();shoulder.position.set(side*.43,1.77,0);g.add(shoulder);
    const upper=new THREE.Mesh(new THREE.CapsuleGeometry(.115,.34,6,12),shirt);upper.position.y=-.25;upper.rotation.x=-.06;upper.castShadow=true;shoulder.add(upper);
    const elbow=new THREE.Group();elbow.position.y=-.48;shoulder.add(elbow);
    const fore=new THREE.Mesh(new THREE.CapsuleGeometry(.095,.32,6,12),shirt);fore.position.y=-.22;fore.castShadow=true;elbow.add(fore);
    const hand=new THREE.Mesh(sphere(.105,14),skin);hand.position.y=-.47;elbow.add(hand);
    joints.arms.push({shoulder,elbow,side});
    const hip=new THREE.Group();hip.position.set(side*.19,.83,0);g.add(hip);
    const thigh=new THREE.Mesh(new THREE.CapsuleGeometry(.145,.38,7,12),pants);thigh.position.y=-.28;thigh.castShadow=true;hip.add(thigh);
    const knee=new THREE.Group();knee.position.y=-.53;hip.add(knee);
    const shin=new THREE.Mesh(new THREE.CapsuleGeometry(.115,.34,7,12),pants);shin.position.y=-.22;shin.castShadow=true;knee.add(shin);
    const foot=new THREE.Mesh(new THREE.BoxGeometry(.29,.16,.48),shoe);foot.position.set(0,-.47,.105);foot.castShadow=true;knee.add(foot);
    const sole=new THREE.Mesh(new THREE.BoxGeometry(.30,.045,.49),mat(0x59616a,.8));sole.position.set(0,-.55,.11);knee.add(sole);
    joints.legs.push({hip,knee,side});
  }
  // Small sleeve seams and wrist bands add silhouette detail.
  for(const side of [-1,1]){const cuff=new THREE.Mesh(new THREE.TorusGeometry(.098,.018,6,16),mat(0xd8f4ef));cuff.rotation.x=Math.PI/2;cuff.position.set(side*.55,1.29,0);g.add(cuff);}
  g.userData.joints=joints;g.userData.glasses=glasses;g.userData.shoeMaterial=shoe;g.userData.shirtMaterial=shirt;g.userData.pantsMaterial=pants;g.userData.skinMaterial=skin;g.userData.hairMaterial=hair;g.userData.mouth=mouth;g.userData.ponytail=ponytail;g.userData.longLocks=longLocks;g.userData.torso=torso;g.userData.action='idle';g.userData.phase=Math.random()*Math.PI*2;g.userData.expression='smile';
  return g;
}
function animateAvatar(avatar,dt,elapsed){
  const j=avatar.userData.joints;if(!j)return;
  const moving=avatar.userData.action==='walk'||avatar.userData.action==='run';
  const gesture=avatar.userData.gesture||'none';
  avatar.userData.phase+=(moving?dt*(avatar.userData.action==='run'?13:8):dt*2.2);
  const phase=avatar.userData.phase,amp=moving?(avatar.userData.action==='run'?.78:.48):.035;
  j.legs.forEach(({hip,knee,side})=>{
    const swing=Math.sin(phase+(side<0?Math.PI:0))*amp;
    if(gesture==='sit'){hip.rotation.x=side===1?-.95:-.95;knee.rotation.x=1.35;}
    else if(gesture==='dance'){hip.rotation.x=swing*.55+Math.sin(phase*2)*.22;knee.rotation.x=.15+Math.max(0,-swing)*.35;}
    else {hip.rotation.x=swing;knee.rotation.x=Math.max(0,-swing)*.9;}
  });
  j.arms.forEach(({shoulder,elbow,side})=>{
    const swing=Math.sin(phase+(side<0?0:Math.PI))*amp*.72;
    shoulder.rotation.x=-swing; shoulder.rotation.z=side*.07; elbow.rotation.x=moving?-.18-Math.max(0,swing)*.5:-.12;
    if(gesture==='wave'&&side===1){shoulder.rotation.x=-.25;shoulder.rotation.z=2.72+Math.sin(elapsed*10)*.18;elbow.rotation.x=-.75+Math.sin(elapsed*10)*.16;}
    if(gesture==='dance'){shoulder.rotation.z=side*(1.1+Math.sin(phase*2+side)*.45);shoulder.rotation.x=Math.sin(phase*2+side)*.35;elbow.rotation.x=-.65;}
    if(gesture==='sit'){shoulder.rotation.z=side*.16;shoulder.rotation.x=-.18;elbow.rotation.x=-.35;}
  });
  avatar.rotation.z=gesture==='dance'?Math.sin(phase*2)*.07:(moving?Math.sin(phase*2)*.025:0);
  avatar.position.y=gesture==='sit'?-.28:Math.max(0,avatar.position.y);
}
function playGesture(name){
  me.userData.gesture=name;
  if(socket)socket.emit('emote',name);
  toast(name==='wave'?'👋 인사합니다':name==='dance'?'💃 춤추기':name==='sit'?'🪑 앉기':'기본 자세');
  if(name!=='sit')setTimeout(()=>{if(me.userData.gesture===name)me.userData.gesture='none';},name==='dance'?4500:2600);
}
const me=makeAvatar();scene.add(me);let myColor='#5eead4',myName='나',coins=120,vehicle=false,move={x:0,z:0};const remote=new Map();let socket=null;
function applyAvatarProfile(a,p={}){if(p.color)a.userData.shirtMaterial?.color.set(p.color);if(p.skin)a.userData.skinMaterial?.color.set(p.skin);if(p.hair)a.userData.hairMaterial?.color.set(p.hair);if(p.pants)a.userData.pantsMaterial?.color.set(p.pants);if(p.shoes)a.userData.shoeMaterial?.color.set(p.shoes);if(p.glasses!==undefined&&a.userData.glasses)a.userData.glasses.visible=!!p.glasses;if(p.hairStyle){a.userData.ponytail.visible=p.hairStyle==='ponytail';a.userData.longLocks.forEach(o=>o.visible=p.hairStyle==='long');}if(p.expression){a.userData.expression=p.expression;const m=a.userData.mouth;if(m){m.scale.y=p.expression==='surprised'?3:p.expression==='sad'?.55:p.expression==='happy'?1.8:1;m.scale.x=p.expression==='happy'?1.5:1;}}}
function addRemote(p){if(p.id===socket?.id||remote.has(p.id))return;const g=makeAvatar(new THREE.Color(p.color||'#fbbf24'));applyAvatarProfile(g,p);g.position.set(p.x||0,0,p.z||0);scene.add(g);remote.set(p.id,{group:g,data:p});}
function updateOnline(){document.querySelector('#online').textContent=remote.size+1;}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function toast(t){const el=document.querySelector('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200);}
function say(t){const p=document.createElement('p');p.innerHTML=t;const feed=document.querySelector('#feed');feed.append(p);feed.scrollTop=feed.scrollHeight;while(feed.children.length>35)feed.firstChild.remove();}
try{if(location.protocol.startsWith('http')&&window.io){socket=io();socket.on('connect',()=>{document.querySelector('#net').textContent='온라인';toast('온라인 월드에 연결됐어요');});socket.on('disconnect',()=>document.querySelector('#net').textContent='오프라인');socket.on('welcome',d=>{d.players.forEach(addRemote);updateOnline();(d.objects||[]).forEach(o=>window.dispatchEvent(new CustomEvent('mv-object',{detail:o})));(d.buildings||[]).forEach(o=>window.dispatchEvent(new CustomEvent('mv-building',{detail:o})));});socket.on('player-joined',p=>{addRemote(p);say(`${escapeHtml(p.name)}님이 입장했습니다.`);updateOnline();});socket.on('player-moved',p=>{const r=remote.get(p.id);if(r){r.data=p;r.group.position.set(p.x,0,p.z);r.group.userData.action=p.action||'idle';}});socket.on('player-profile',p=>{const r=remote.get(p.id);if(r){r.data=p;applyAvatarProfile(r.group,p);}});socket.on('player-emote',p=>{const r=remote.get(p.id);if(r){r.group.userData.gesture=p.gesture;setTimeout(()=>{if(r.group.userData.gesture===p.gesture&&p.gesture!=='sit')r.group.userData.gesture='none';},p.gesture==='dance'?4500:2600);}});socket.on('player-left',id=>{const r=remote.get(id);if(r){scene.remove(r.group);remote.delete(id);}updateOnline();});socket.on('chat',m=>say(`<b>${escapeHtml(m.name)}:</b> ${escapeHtml(m.text)}`));socket.on('world-object',o=>window.dispatchEvent(new CustomEvent('mv-object',{detail:o})));socket.on('world-building',o=>window.dispatchEvent(new CustomEvent('mv-building',{detail:o}))); }}catch(e){console.error('Socket.IO 초기화 실패',e);document.querySelector('#net').textContent='로컬 모드';}
// Persistent shared home/build objects (simple 3D furniture props)
const placedIds=new Set(),placedGroups=new Map();function renderWorldProp(o,isBuilding=false){if(!o||placedIds.has(o.id))return;placedIds.add(o.id);const g=new THREE.Group();const wood=mat(isBuilding?0x9a7655:0x8b6548,.7,.1),fabric=mat(0x477d88,.8,.05),dark=materials.dark;if(isBuilding){const bw=Number(o.width)||5,bh=Number(o.height)||3.2,bd=Number(o.depth)||5;const base=new THREE.Mesh(new THREE.BoxGeometry(bw,bh,bd),wood);base.position.y=bh/2;g.add(base);const roof=new THREE.Mesh(new THREE.ConeGeometry(Math.max(Number(o.width)||5,Number(o.depth)||5)*.86,1.8,4),mat(0x354c5b));roof.position.y=(Number(o.height)||3.2)+.8;roof.rotation.y=Math.PI/4;g.add(roof);}else{const type=o.type||'sofa';if(type.includes('bed')){const b=new THREE.Mesh(new THREE.BoxGeometry(2.4,.35,3.2),wood);b.position.y=.45;g.add(b);const mattress=new THREE.Mesh(new THREE.BoxGeometry(2.3,.3,3.05),fabric);mattress.position.y=.78;g.add(mattress);const pillow=new THREE.Mesh(new THREE.BoxGeometry(.8,.18,.55),mat(0xe9e3d6),);pillow.position.set(0,1,-1.05);g.add(pillow);}else if(type.includes('plant')){const pot=new THREE.Mesh(new THREE.CylinderGeometry(.35,.25,.6,12),wood);pot.position.y=.3;g.add(pot);const leaves=new THREE.Mesh(new THREE.IcosahedronGeometry(.8,1),mat(0x39865a));leaves.position.y=1.2;g.add(leaves);}else if(type.includes('table')){const top=new THREE.Mesh(new THREE.BoxGeometry(2,.18,1.2),wood);top.position.y=.95;g.add(top);for(const x of [-.8,.8])for(const z of [-.4,.4]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.12,.9,.12),dark);leg.position.set(x,.45,z);g.add(leg);}}else if(type.includes('lamp')){const stem=new THREE.Mesh(new THREE.CylinderGeometry(.06,.08,1.8,10),dark);stem.position.y=.9;g.add(stem);const shade=new THREE.Mesh(new THREE.ConeGeometry(.48,.55,12,1,true),mat(0xe8d49b));shade.position.y=1.85;g.add(shade);}else if(type.includes('tv')){const screen=new THREE.Mesh(new THREE.BoxGeometry(2,.12,1.2),mat(0x101820,.25,.3));screen.position.y=1.5;g.add(screen);const stand=new THREE.Mesh(new THREE.BoxGeometry(.35,.7,.35),dark);stand.position.y=.65;g.add(stand);}else{const seat=new THREE.Mesh(new THREE.BoxGeometry(2,.55,1),fabric);seat.position.y=.65;g.add(seat);const back=new THREE.Mesh(new THREE.BoxGeometry(2,.9,.25),fabric);back.position.set(0,1.25,-.38);g.add(back);for(const x of [-.8,.8])for(const z of [-.35,.35]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.12,.55,.12),dark);leg.position.set(x,.28,z);g.add(leg);}}}g.position.set(Number(o.x)||0,0,Number(o.z)||0);g.rotation.y=Number(o.rotation)||0;g.traverse(x=>{if(x.isMesh){x.castShadow=true;x.receiveShadow=true;}});g.userData.objectId=o.id;g.userData.isBuilding=isBuilding;placedGroups.set(o.id,g);scene.add(g);}window.addEventListener('mv-object',e=>renderWorldProp(e.detail,false));window.addEventListener('mv-building',e=>renderWorldProp(e.detail,true));window.addEventListener('mv-update',e=>{const o=e.detail,old=placedGroups.get(o.id);if(old){scene.remove(old);placedGroups.delete(o.id);placedIds.delete(o.id)}renderWorldProp(o,!!o.width||!!o.height||!!o.depth||o.type==='house')});window.addEventListener('mv-delete',e=>{const id=e.detail,old=placedGroups.get(id);if(old)scene.remove(old);placedGroups.delete(id);placedIds.delete(id)});
let privateHome=null,homeReturn=null,homeDoor=null,doorOpen=false;
function enterPrivateHome(){
 if(privateHome)return;
 homeReturn={x:me.position.x,z:me.position.z};
 const cx=me.position.x,cz=me.position.z; privateHome=new THREE.Group(); privateHome.position.set(cx,0,cz); scene.add(privateHome);
 const floorMat=mat(0xb69a78,.88),wallMat=mat(0xe8e1d4,.92),trimMat=mat(0x76533c,.7),glassMat=mat(0x8bc7d8,.2,.15);
 const add=(w,h,d,m,x,y,z)=>{const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);q.position.set(x,y,z);q.castShadow=true;q.receiveShadow=true;privateHome.add(q);return q;};
 add(14,.22,12,floorMat,0,-.12,0);
 add(14,3.2,.22,wallMat,0,1.6,-6); add(.22,3.2,12,wallMat,-7,1.6,0); add(.22,3.2,12,wallMat,7,1.6,0);
 // Front wall with a centered doorway
 add(4.8,3.2,.22,wallMat,-4.6,1.6,6); add(4.8,3.2,.22,wallMat,4.6,1.6,6); add(4.4,.7,.22,wallMat,0,2.85,6);
 add(14,.18,12,wallMat,0,3.25,0);
 // Bedroom partition with a hinged interior door and a clear doorway.
 add(.18,3.1,3.2,wallMat,2.7,1.55,-1.4); add(.18,3.1,4.1,wallMat,2.7,1.55,3.95);
 homeDoor=new THREE.Group();homeDoor.position.set(2.7,0,.65);privateHome.add(homeDoor);const doorMesh=new THREE.Mesh(new THREE.BoxGeometry(.12,2.7,2.2),trimMat);doorMesh.position.set(0,1.35,1.1);doorMesh.castShadow=true;homeDoor.add(doorMesh);doorOpen=false;
 const bedroomSign=label('BEDROOM','#ffffff');bedroomSign.position.set(4.4,2.55,-2.2);bedroomSign.scale.set(2.4,.7,1);privateHome.add(bedroomSign);
 for(const x of [-4.8,4.8]){add(2.2,1.35,.08,glassMat,x,1.9,-5.86);add(2.35,.12,.18,trimMat,x,1.2,-5.78);}
 const rug=add(5,.05,3,mat(0x547d83),0,.02,0);rug.name='living-room-rug';
 const sign=label('MY HOME · E 또는 나가기 버튼으로 퇴장','#ffffff');sign.position.set(0,2.8,5.7);sign.scale.set(5,1.25,1);privateHome.add(sign);
 me.position.set(cx,0,cz); toast('🏡 나만의 집에 입장했습니다');
}
function exitPrivateHome(){if(!privateHome)return;scene.remove(privateHome);privateHome=null;homeDoor=null;if(homeReturn){me.position.set(homeReturn.x,0,homeReturn.z);homeReturn=null;}toast('도시로 나왔습니다');}
window.MVEditor={scene,camera,placedGroups,getPlayer:()=>({x:me.position.x,z:me.position.z}),setPlayer:(x,z)=>{me.position.x=THREE.MathUtils.clamp(x,-185,185);me.position.z=THREE.MathUtils.clamp(z,-88,88)},enterHome:enterPrivateHome,exitHome:exitPrivateHome,isInsideHome:()=>!!privateHome,THREE,setFloor:(y)=>{me.position.y=THREE.MathUtils.clamp(Number(y)||0,0,12);vy=0;onGround=true;},getSocket:()=>socket,getPosition:()=>({x:me.position.x,y:me.position.y,z:me.position.z,rotation:me.rotation.y})};
// Keyboard, mouse orbit and touch joystick
const keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.code==='Space'){e.preventDefault();jump();}if(e.key.toLowerCase()==='e'){if(privateHome&&homeDoor){doorOpen=!doorOpen;homeDoor.rotation.y=doorOpen?-Math.PI/2:0;toast(doorOpen?'침실 문을 열었습니다':'침실 문을 닫았습니다');}else enterExitHub();}});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
let yaw=0,drag=false,lastX=0;renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){drag=true;lastX=e.clientX;}});addEventListener('pointerup',()=>drag=false);addEventListener('pointermove',e=>{if(drag){yaw-=(e.clientX-lastX)*.005;lastX=e.clientX;}});
const joy=document.querySelector('#joystick'),stick=document.querySelector('#stick');let joyActive=false;function joyMove(e){const r=joy.getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),l=Math.hypot(dx,dy),max=34;if(l>max){dx=dx/l*max;dy=dy/l*max;}stick.style.transform=`translate(${dx}px,${dy}px)`;move.x=dx/max;move.z=dy/max;}joy.addEventListener('pointerdown',e=>{joyActive=true;joy.setPointerCapture(e.pointerId);joyMove(e);});joy.addEventListener('pointermove',e=>{if(joyActive)joyMove(e);});function resetJoy(){joyActive=false;move={x:0,z:0};stick.style.transform='translate(0,0)';}joy.addEventListener('pointerup',resetJoy);joy.addEventListener('pointercancel',resetJoy);
let vy=0,onGround=true;let carSpeed=0,carSteer=0;function jump(){if(onGround){vy=7.2;onGround=false;}}
let lastSend=0,lastXpos=0,lastZpos=0;const clock=new THREE.Clock();
function districtName(x){return x < -65 ? '현대 대도시' : x > 65 ? '미래 도시' : '자연 생활도시';}
function animate(t){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);let f=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0),s=(keys.a||keys.arrowleft?1:0)-(keys.d||keys.arrowright?1:0);f+=-move.z;s+=-move.x;let len=Math.hypot(f,s);if(len>1){f/=len;s/=len;}let dx=0,dz=0;if(vehicle){const throttle=(keys.w||keys.arrowup?1:0),brake=(keys.s||keys.arrowdown?1:0);carSpeed=THREE.MathUtils.clamp(carSpeed+throttle*12*dt-brake*20*dt-(throttle===0&&brake===0?Math.sign(carSpeed)*5*dt:0),-8,28);const steer=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0);carSteer=THREE.MathUtils.damp(carSteer,steer,5,dt);me.rotation.y-=carSteer*(.35+Math.abs(carSpeed)/28*.85)*dt*Math.sign(carSpeed||1);dx=Math.sin(me.rotation.y)*carSpeed*dt;dz=Math.cos(me.rotation.y)*carSpeed*dt;document.querySelector('#mv-speed')?.replaceChildren(document.createTextNode(Math.round(Math.abs(carSpeed)*3.6)+' km/h'));}else{carSpeed=0;const speed=7;dx=(s*Math.cos(yaw)-f*Math.sin(yaw))*speed*dt;dz=(s*Math.sin(yaw)+f*Math.cos(yaw))*speed*dt;}me.userData.action=len>.08?(vehicle?'run':'walk'):'idle';let nx=THREE.MathUtils.clamp(me.position.x+dx,insideHub?hubX-9:-188,insideHub?hubX+9:188),nz=THREE.MathUtils.clamp(me.position.z+dz,insideHub?hubZ-7:-88,insideHub?hubZ+7:88);if(vehicle&&window.MVCollision?.(nx,nz)){nx=me.position.x;nz=me.position.z;carSpeed*=-.22;}me.position.x=nx;me.position.z=nz;if(len>.08&&!vehicle)me.rotation.y=Math.atan2(dx,dz);vy-=18*dt;const floorY=Number(window.MVFloorY)||0;me.position.y=Math.max(floorY,me.position.y+vy*dt);if(me.position.y===floorY){vy=0;onGround=true;}if(vehicle){myCar.visible=true;myCar.position.copy(me.position);myCar.position.y=0;myCar.rotation.y=me.rotation.y;me.visible=false;}else{myCar.visible=false;me.visible=true;}
  const target=new THREE.Vector3(me.position.x-Math.sin(yaw)*10,me.position.y+6,me.position.z-Math.cos(yaw)*10);camera.position.lerp(target,.12);camera.lookAt(me.position.x,me.position.y+1.2,me.position.z);
  if(socket&&t-lastSend>90&&(Math.abs(me.position.x-lastXpos)>.05||Math.abs(me.position.z-lastZpos)>.05)){socket.emit('move',{x:me.position.x,z:me.position.z,action:len>.08?(vehicle?'run':'walk'):'idle'});socket.emit('party-position',{x:me.position.x,y:me.position.y,z:me.position.z,rotation:me.rotation.y});lastXpos=me.position.x;lastZpos=me.position.z;lastSend=t;}
  animateAvatar(me,dt,t/1000);for(const r of remote.values())animateAvatar(r.group,dt,t/1000);
  renderer.render(scene,camera);
}
camera.position.set(0,7,13);requestAnimationFrame(animate);addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
// Chat
 document.querySelector('#send').onclick=sendChat;document.querySelector('#chatInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendChat();});function sendChat(){const i=document.querySelector('#chatInput'),v=i.value.trim();if(!v)return;if(socket)socket.emit('chat',v);else say(`<b>나:</b> ${escapeHtml(v)}`);i.value='';}
// Menus and prototype interactions
const modal=document.querySelector('#modal'),title=document.querySelector('#modalTitle'),body=document.querySelector('#modalBody');
function openModal(k){modal.classList.add('open');let html='';if(k==='profile'){title.textContent='아바타 꾸미기';html=`<p>이름, 피부톤, 헤어, 의상과 표정을 설정하세요.</p><input id="nameField" maxlength="18" placeholder="캐릭터 이름" value="${escapeHtml(myName)}"><p>상의 색상</p><div class="row"><button class="pill color" data-color="#5eead4">민트</button><button class="pill color" data-color="#fbbf24">골드</button><button class="pill color" data-color="#a78bfa">보라</button><button class="pill color" data-color="#fb7185">핑크</button></div><p>피부톤</p><div class="row"><button class="pill skin" data-skin="#f2c6a5">밝음</button><button class="pill skin" data-skin="#d7a27f">보통</button><button class="pill skin" data-skin="#986448">짙음</button></div><p>헤어스타일</p><div class="row"><button class="pill hairStyle" data-style="short">숏</button><button class="pill hairStyle" data-style="long">롱</button><button class="pill hairStyle" data-style="ponytail">묶음</button></div><p>헤어 색상</p><div class="row"><button class="pill hairColor" data-hair="#171b25">블랙</button><button class="pill hairColor" data-hair="#70452d">브라운</button><button class="pill hairColor" data-hair="#c5a15b">골드</button></div><p>바지 색상</p><div class="row"><button class="pill pants" data-pants="#253448">네이비</button><button class="pill pants" data-pants="#343b45">차콜</button><button class="pill pants" data-pants="#66513d">브라운</button></div><p>신발 색상</p><div class="row"><button class="pill shoes" data-shoes="#111923">블랙</button><button class="pill shoes" data-shoes="#e8e8e2">화이트</button></div><p>액세서리</p><div class="row"><button class="pill" id="toggleGlasses">안경 켜기 / 끄기</button></div><p>표정</p><div class="row"><button class="pill expression" data-expression="smile">기본</button><button class="pill expression" data-expression="happy">웃음</button><button class="pill expression" data-expression="sad">슬픔</button><button class="pill expression" data-expression="surprised">놀람</button></div><button class="btn" id="saveProfile">저장하기</button>`;}else if(k==='build'){title.textContent='건물 만들기';html='<p>현재 위치 앞에 작은 건물을 배치하는 프로토타입입니다.</p><span class="tag">건축 모드</span><button class="btn" id="placeBuild">내 앞에 건물 배치 (무료)</button>';}else if(k==='shop'){title.textContent='월드 상점';html=`<p>보유 코인: <b>${coins}</b></p><span class="tag">아바타 아이템</span><p>✨ 네온 오라 — 50 코인</p><button class="btn" id="buyAura">구매하기</button>`;}else if(k==='game'){title.textContent='미니게임';html='<p>🎯 코인 수집 챌린지</p><p>버튼을 누르면 코인을 획득하는 테스트입니다.</p><button class="btn" id="playGame">도전하기 (+10 코인)</button>';}else if(k==='friends'){title.textContent='접속자 / 친구';html=`<p>현재 월드 접속자: ${remote.size+1}명</p><p>나 · ${escapeHtml(myName)} <span class="tag">나</span></p>${[...remote.values()].map(r=>`<p>${escapeHtml(r.data.name)} <span class="tag">온라인</span></p>`).join('')||'<p>아직 다른 접속자가 없습니다. 서버 주소를 공유해 보세요.</p>'}`;}else{title.textContent='조작 방법';html=`<p><b>PC</b>: W A S D 또는 방향키 이동, 마우스 드래그로 시점 변경, Space 점프</p><p><b>아이폰</b>: 왼쪽 조이스틱 이동, 아래 건물 입장 버튼으로 실내 출입</p><p><b>건물</b>: 현대 도시 상점가 입구에서 E 또는 건물 입장 버튼. 실내에서 다시 누르면 나옵니다.</p><p><b>지역</b>: 왼쪽은 현대 대도시, 중앙은 자연 생활도시, 오른쪽은 미래 도시입니다. 도로를 따라 이동해 보세요.</p><p>실시간 접속은 서버를 실행하고 인터넷에 배포해야 합니다.</p>`;}
body.innerHTML=html;body.querySelectorAll('.color').forEach(b=>b.onclick=()=>{myColor=b.dataset.color;me.userData.shirtMaterial?.color.set(myColor);});body.querySelectorAll('.skin').forEach(b=>b.onclick=()=>{me.userData.skinMaterial.color.set(b.dataset.skin);me.userData.profileSkin=b.dataset.skin;});body.querySelectorAll('.hairStyle').forEach(b=>b.onclick=()=>{applyAvatarProfile(me,{hairStyle:b.dataset.style});me.userData.profileHairStyle=b.dataset.style;});body.querySelectorAll('.hairColor').forEach(b=>b.onclick=()=>{me.userData.hairMaterial.color.set(b.dataset.hair);me.userData.profileHair=b.dataset.hair;});body.querySelectorAll('.expression').forEach(b=>b.onclick=()=>{applyAvatarProfile(me,{expression:b.dataset.expression});me.userData.profileExpression=b.dataset.expression;});body.querySelectorAll('.pants').forEach(b=>b.onclick=()=>{me.userData.pantsMaterial.color.set(b.dataset.pants);me.userData.profilePants=b.dataset.pants;});body.querySelectorAll('.shoes').forEach(b=>b.onclick=()=>{me.userData.shoeMaterial.color.set(b.dataset.shoes);me.userData.profileShoes=b.dataset.shoes;});const glassesBtn=body.querySelector('#toggleGlasses');if(glassesBtn)glassesBtn.onclick=()=>{me.userData.glasses.visible=!me.userData.glasses.visible;me.userData.profileGlasses=me.userData.glasses.visible;};const save=body.querySelector('#saveProfile');if(save)save.onclick=()=>{myName=body.querySelector('#nameField').value.trim()||'나';if(socket)socket.emit('profile',{name:myName,color:myColor,skin:me.userData.profileSkin||'#d7a27f',hair:me.userData.profileHair||'#171b25',hairStyle:me.userData.profileHairStyle||'short',expression:me.userData.profileExpression||'smile',pants:me.userData.profilePants||'#253448',shoes:me.userData.profileShoes||'#111923',glasses:!!me.userData.profileGlasses});toast('아바타 정보를 적용했습니다');modal.classList.remove('open');};const place=body.querySelector('#placeBuild');if(place)place.onclick=()=>{const b=new THREE.Group();const wall=new THREE.Mesh(new THREE.BoxGeometry(4,3,4),mat(0x9bc7c3,.5,.15));wall.position.y=1.5;wall.castShadow=true;b.add(wall);const roof=new THREE.Mesh(new THREE.ConeGeometry(3.6,1.6,4),mat(0x244a5a));roof.position.y=3.8;roof.rotation.y=Math.PI/4;b.add(roof);b.position.set(me.position.x-Math.sin(yaw)*7,0,me.position.z-Math.cos(yaw)*7);scene.add(b);toast('건물을 배치했습니다');modal.classList.remove('open');};const buy=body.querySelector('#buyAura');if(buy)buy.onclick=()=>{if(coins<50){toast('코인이 부족합니다');return;}coins-=50;document.querySelector('#coins').textContent=coins;toast('네온 아이템을 구매했습니다');modal.classList.remove('open');};const play=body.querySelector('#playGame');if(play)play.onclick=()=>{coins+=10;document.querySelector('#coins').textContent=coins;toast('성공! 10 코인을 획득했습니다');modal.classList.remove('open');};}
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openModal(b.dataset.open));document.querySelector('#closeModal').onclick=()=>modal.classList.remove('open');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open');});document.querySelector('#emote').onclick=()=>{const faces=['happy','surprised','smile'];const next=faces[(faces.indexOf(me.userData.expression)+1)%faces.length];applyAvatarProfile(me,{expression:next});me.userData.profileExpression=next;toast(next==='happy'?'😄 웃는 표정':next==='surprised'?'😮 놀란 표정':'🙂 기본 표정');if(socket)socket.emit('profile',{name:myName,color:myColor,expression:next});};const hubButton=document.querySelector('#hub');if(hubButton)hubButton.onclick=enterExitHub;document.querySelector('#ride').onclick=()=>{vehicle=!vehicle;document.querySelector('#ride').textContent=vehicle?'🚶 걷기':'🚗 탈것';toast(vehicle?'차량 탑승! 이동 속도가 빨라졌습니다':'도보 모드');};
const dash=document.createElement('div');dash.id='mv-driving';dash.innerHTML='<div id="mv-speed">0 km/h</div><div class="mv-drive-row"><button data-drive="left">◀</button><button data-drive="brake">브레이크</button><button data-drive="right">▶</button></div><button data-drive="gas">가속</button>';dash.style.cssText='display:none;position:fixed;right:14px;bottom:24px;z-index:20;background:#102b39dd;color:white;padding:10px;border-radius:14px;text-align:center;font: bold 14px system-ui;touch-action:none';const ds=document.createElement('style');ds.textContent='#mv-driving button{min-width:54px;min-height:48px;margin:4px;border:1px solid #9ac;border-radius:10px;background:#24566b;color:white;font-weight:bold}#mv-speed{padding:5px}';document.head.append(ds);document.body.append(dash);function driveHold(btn,key){const down=e=>{e.preventDefault();keys[key]=true},up=e=>{e.preventDefault();keys[key]=false};btn.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave'].forEach(ev=>btn.addEventListener(ev,up));}dash.querySelectorAll('[data-drive]').forEach(b=>driveHold(b,({left:'a',right:'d',gas:'w',brake:'s'})[b.dataset.drive]));const oldRide=document.querySelector('#ride').onclick;document.querySelector('#ride').onclick=()=>{oldRide();dash.style.display=vehicle?'block':'none';if(!vehicle){carSpeed=0;}};document.querySelector('#voice').onclick=()=>toast('음성 채팅은 WebRTC 서버 연동이 필요한 다음 단계 기능입니다.');document.querySelector('#wave').onclick=()=>playGesture('wave');document.querySelector('#dance').onclick=()=>playGesture('dance');document.querySelector('#sit').onclick=()=>playGesture(me.userData.gesture==='sit'?'none':'sit');
