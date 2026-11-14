import * as THREE from './assets/three.module.js';

function bootFridgeScene(){
const host=document.querySelector('.landing-fridge');
if(host){
const oldCards=[...host.querySelectorAll('.landing-dish')].map(el=>({key:el.dataset.key,img:el.querySelector('img')?.src}));
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(34,1,.1,100);
let renderer;
try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}
catch(error){renderer=softwareRenderer();}
host.replaceChildren();host.classList.add('webgl-fridge');
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
host.append(renderer.domElement);
const key=new THREE.DirectionalLight(0xfff4dc,4.5);key.position.set(-4,6,7);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-6;key.shadow.camera.right=6;key.shadow.camera.top=6;key.shadow.camera.bottom=-6;scene.add(key);
scene.add(new THREE.HemisphereLight(0xfff9ec,0x916d4b,2.6));
const fill=new THREE.DirectionalLight(0xffffff,2);fill.position.set(4,3,1);scene.add(fill);
// Studio reflection panels remain outside the visible scene.
if(renderer.isWebGLRenderer){const studio=new THREE.Scene();studio.background=new THREE.Color(0xc5b7a0);const panelMat=new THREE.MeshBasicMaterial({color:0xffffff});for(const [x,y,z,w,h] of [[-4,3,4,2,7],[4,4,2,1.5,6],[0,6,0,6,2]]){const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),panelMat);panel.position.set(x,y,z);panel.lookAt(0,0,0);studio.add(panel);}const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(studio,.05).texture;pmrem.dispose();}
const cream=new THREE.MeshPhysicalMaterial({color:0xffedcf,roughness:.19,metalness:.04,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:.85});
const inside=new THREE.MeshPhysicalMaterial({color:0xffe9c5,roughness:.28,clearcoat:.9,clearcoatRoughness:.17});
const orange=new THREE.MeshPhysicalMaterial({color:0xec841f,roughness:.18,metalness:.4,clearcoat:1,clearcoatRoughness:.10});
const gasket=new THREE.MeshStandardMaterial({color:0x9b7447,roughness:.8});
const appliance=new THREE.Group();scene.add(appliance);
function rounded(w,h,d,r,mat){const shape=new THREE.Shape();shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const geo=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSize:.035,bevelThickness:.035,bevelSegments:3,steps:1,curveSegments:12});geo.translate(0,0,-d/2);const m=new THREE.Mesh(geo,mat);m.castShadow=true;m.receiveShadow=true;return m;}
function block(w,h,d,x,y,z,mat=cream,parent=appliance,r=.055){const m=rounded(w,h,d,r,mat);m.position.set(x,y,z);parent.add(m);return m;}
// Five solid cabinet walls surround a real recessed cavity.
block(3.35,4.25,.16,0,.15,-.68,cream,appliance,.24);
block(.16,4.1,1.2,-1.59,.15,0);block(.16,4.1,1.2,1.59,.15,0);
block(3.2,.18,1.2,0,2.16,0);block(3.2,.18,1.2,0,-1.86,0);
block(2.99,3.82,.06,0,.15,-.55,inside,appliance,.18);
for(const y of [-1.55,-.32,.92])block(3.04,.085,1.03,0,y,.03,inside);
for(const x of [-1.22,1.22])block(.22,.3,.26,x,-2.12,.07,orange);
const lamp=new THREE.PointLight(0xffdf99,8,5,2);lamp.position.set(0,1.8,.15);appliance.add(lamp);
const lampMat=new THREE.MeshStandardMaterial({color:0xfffae1,emissive:0xffdf99,emissiveIntensity:2});block(.7,.045,.3,0,1.99,.04,lampMat);
// Each door is a thick object with a front, inner liner, seal and handle.
const hinges=[];
for(const side of [-1,1]){
 const hinge=new THREE.Group();hinge.position.set(side*1.64,.15,.66);appliance.add(hinge);hinges.push(hinge);
 const mid=-side*.82;
 block(1.62,4.18,.065,mid,0,.01,orange,hinge,.18);
 block(1.53,4.09,.17,mid,0,.10,cream,hinge,.16);
 block(1.49,3.96,.06,mid,0,-.07,gasket,hinge,.14);
 block(1.40,3.86,.10,mid,0,-.13,inside,hinge,.12);
 for(const y of [-1.28,-.10,1.05])block(1.20,.21,.26,mid,y,-.28,inside,hinge);
 const hx=mid-side*.51;
 for(const y of [-.24,.47])block(.085,.09,.14,hx,y,.27,orange,hinge,.025);
 block(.10,.83,.12,hx,.115,.36,orange,hinge,.045);
}
const shadow=new THREE.Mesh(new THREE.PlaneGeometry(13,13),new THREE.ShadowMaterial({opacity:.16}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-2.29;shadow.receiveShadow=true;scene.add(shadow);
const food=[];const loader=new THREE.TextureLoader();
const items=[['omurice','Omurice','🍳',-.72,1.47],['sushi','Sushi','🍣',.72,1.47],['ramen','Ramen','🍜',-.9,.23],['curry','Japanese Curry','🍛',.9,.23],['udon','Udon','🍜',0,-1.0]];
for(const [id,name,emoji,x,y] of items){
 const c=document.createElement('canvas');c.width=512;c.height=320;const ctx=c.getContext('2d');
 const draw=(img)=>{ctx.clearRect(0,0,512,320);ctx.save();ctx.beginPath();ctx.roundRect(3,3,506,314,36);ctx.clip();ctx.fillStyle='#f4d198';ctx.fillRect(0,0,512,320);if(img){const s=Math.max(512/img.width,320/img.height);ctx.drawImage(img,(512-img.width*s)/2,(320-img.height*s)/2,img.width*s,img.height*s);}else{ctx.font='110px sans-serif';ctx.textAlign='center';ctx.fillText(emoji,256,180);}const shade=ctx.createLinearGradient(0,160,0,320);shade.addColorStop(0,'#48281100');shade.addColorStop(1,'#482811e0');ctx.fillStyle=shade;ctx.fillRect(0,160,512,160);ctx.fillStyle='#fff8e9';ctx.beginPath();ctx.roundRect(id==='omurice'?375:278,18,id==='omurice'?115:212,55,27);ctx.fill();ctx.fillStyle='#875133';ctx.font='900 24px sans-serif';ctx.textAlign='center';ctx.fillText(id==='omurice'?'LIVE':'COMING SOON',id==='omurice'?432:384,54);ctx.fillStyle='#ffffff';ctx.font='900 34px sans-serif';ctx.textAlign='left';ctx.fillText(name,23,291);ctx.restore();ctx.strokeStyle='#fffaf0';ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(3,3,506,314,36);ctx.stroke();tex.needsUpdate=true;};
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;draw();
 const url={omurice:'assets/omurice-hero.png',ramen:'assets/landing-ramen.jpg',curry:'assets/landing-curry.jpg',udon:'assets/landing-udon.jpg'}[id]||oldCards.find(a=>a.key===id)?.img;if(url){const img=new Image();img.crossOrigin='anonymous';img.onload=()=>draw(img);img.src=url;}
 const mat=new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.01,side:THREE.DoubleSide});
 const card=new THREE.Mesh(new THREE.PlaneGeometry(1.23,.85),mat);card.position.set(x,y,.20);card.userData={id,name,baseZ:.20};appliance.add(card);food.push(card);
 // Shallow ivory plate gives each recipe a physical resting surface.
 block(1.30,.045,.60,x,y-.48,.15,inside);
}
const action=document.createElement('button');action.className='fridge-food-action';action.hidden=true;host.append(action);
let selected=null,hovered=null,started=performance.now();
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
function pick(event){const r=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(food)[0]?.object||null;}
renderer.domElement.addEventListener('pointermove',e=>{if(performance.now()-started<7000)return;hovered=pick(e);renderer.domElement.style.cursor=hovered?'pointer':'default';});
renderer.domElement.addEventListener('pointerleave',()=>hovered=null);
renderer.domElement.addEventListener('click',e=>{if(performance.now()-started<7000)return;selected=pick(e);if(!selected){action.hidden=true;return;}action.hidden=false;action.textContent=selected.userData.id==='omurice'?'Get started →':'Coming soon';});
action.addEventListener('click',()=>{if(selected)window.startFromLanding(selected.userData.id,selected.userData.id==='omurice');});
window.replayFridgeOpening=()=>{started=performance.now();selected=null;hovered=null;action.hidden=true;};
document.querySelector('.landing-replay')?.removeAttribute('disabled');
function resize(){const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();
const ease=x=>{x=THREE.MathUtils.clamp(x,0,1);return x*x*(3-2*x);};
function frame(now){requestAnimationFrame(frame);const t=(now-started)/1000,approach=ease(t/3.5),opening=ease((t-3.8)/3.2),settle=ease((t-7)/1);
 camera.position.set(THREE.MathUtils.lerp(-3.1,0,approach),THREE.MathUtils.lerp(1.25,.35,approach),THREE.MathUtils.lerp(13,10.6,approach)-settle*.3);camera.lookAt(0,.1,0);
 hinges[0].rotation.y=-opening*Math.PI*.69;hinges[1].rotation.y=opening*Math.PI*.69;
 for(const card of food){const target=card===hovered?1.065:1;card.scale.lerp(new THREE.Vector3(target,target,target),.13);card.position.z=THREE.MathUtils.lerp(card.position.z,card===hovered?.38:.16,.13);}
 renderer.render(scene,camera);
}requestAnimationFrame(frame);
}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootFridgeScene,{once:true});else bootFridgeScene();

// Compatibility path: project the same mesh geometry when WebGL is disabled.
function softwareRenderer(){
const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');let width=1,height=1;
const api={domElement:canvas,shadowMap:{},setPixelRatio(){},setClearColor(){},setSize(w,h){width=canvas.width=w;height=canvas.height=h;},render(scene,camera){
ctx.clearRect(0,0,width,height);scene.updateMatrixWorld();camera.updateMatrixWorld();const faces=[];const light=new THREE.Vector3(-.4,.7,.8).normalize();
scene.traverse(obj=>{if(!obj.isMesh||!obj.visible||obj.material.isShadowMaterial)return;const geo=obj.geometry,pos=geo.attributes.position,index=geo.index,uv=geo.attributes.uv;const mat=obj.material;if(Array.isArray(mat))return;
const count=index?index.count:pos.count;for(let i=0;i<count;i+=3){const ids=[0,1,2].map(k=>index?index.getX(i+k):i+k);const points=ids.map(j=>new THREE.Vector3().fromBufferAttribute(pos,j).applyMatrix4(obj.matrixWorld));const norm=new THREE.Vector3().subVectors(points[1],points[0]).cross(new THREE.Vector3().subVectors(points[2],points[0])).normalize();if(norm.dot(new THREE.Vector3().subVectors(camera.position,points[0]))<=0)continue;
const screen=points.map(v=>v.clone().project(camera));if(screen.some(p=>p.z>1||p.z< -1))continue;const color=mat.color.clone().multiplyScalar(.64+.36*Math.max(0,norm.dot(light)));faces.push({z:screen.reduce((n,p)=>n+p.z,0)/3,p:screen.map(v=>[(v.x+1)*width/2,(1-v.y)*height/2]),color:'#'+color.getHexString(),img:mat.map?.image,uv:uv?ids.map(j=>[uv.getX(j),uv.getY(j)]):null});}
});faces.sort((a,b)=>b.z-a.z);for(const f of faces){const [a,b,c]=f.p;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.lineTo(...c);ctx.closePath();ctx.fillStyle=f.color;ctx.fill();if(f.img&&f.uv){const s=f.uv.map(v=>[v[0]*f.img.width,(1-v[1])*f.img.height]);const [u,v,w]=s;const det=u[0]*(v[1]-w[1])+v[0]*(w[1]-u[1])+w[0]*(u[1]-v[1]);if(Math.abs(det)>.001){const coeff=t=>[(t[0]*(v[1]-w[1])+t[1]*(w[1]-u[1])+t[2]*(u[1]-v[1]))/det,(t[0]*(w[0]-v[0])+t[1]*(u[0]-w[0])+t[2]*(v[0]-u[0]))/det,(t[0]*(v[0]*w[1]-w[0]*v[1])+t[1]*(w[0]*u[1]-u[0]*w[1])+t[2]*(u[0]*v[1]-v[0]*u[1]))/det];const x=coeff([a[0],b[0],c[0]]),y=coeff([a[1],b[1],c[1]]);ctx.save();ctx.clip();ctx.transform(x[0],y[0],x[1],y[1],x[2],y[2]);ctx.drawImage(f.img,0,0);ctx.restore();}}}
}};return api;
}
