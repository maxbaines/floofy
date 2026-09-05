import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {adult,baby} from '../source/models.mjs';

const stage=document.querySelector('#stage');
const scene=new THREE.Scene();scene.background=new THREE.Color('#e7dece');
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
stage.prepend(renderer.domElement);
const camera=new THREE.PerspectiveCamera(33,1,.1,500);camera.position.set(29,21,42);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,9,0);controls.enableDamping=true;controls.maxPolarAngle=Math.PI/2;controls.autoRotateSpeed=1.2;
scene.add(new THREE.HemisphereLight('#fff6e5','#9e8b73',3));
const sun=new THREE.DirectionalLight('#ffffff',2.4);sun.position.set(-25,55,35);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-50,right:50,top:50,bottom:-50});sun.shadow.normalBias=.05;scene.add(sun);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(1000,1000),new THREE.MeshStandardMaterial({color:'#e7dece',roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.04;floor.receiveShadow=true;scene.add(floor);

function cubeGeometry(c,tw,th){
  let [x,y,z,w,h,d]=c.box;const g=c.inflate||0;
  let x0=x-g,x1=x+w+g,y0=y-g,y1=y+h+g,z0=z-g,z1=z+d+g;
  if(c.mirror)[x0,x1]=[x1,x0];
  const t0=[x0,y0,z0],t1=[x1,y0,z0],t2=[x1,y1,z0],t3=[x0,y1,z0];
  const l0=[x0,y0,z1],l1=[x1,y0,z1],l2=[x1,y1,z1],l3=[x0,y1,z1];
  const [u,v]=c.uv,u1=u+d,u2=u+d+w,u22=u+d+2*w,u3=u+2*d+w,u4=u+2*d+2*w,v1=v+d,v2=v+d+h;
  const quads=[
    [[l1,l0,t0,t1],[u1,v,u2,v1]],[[t2,t3,l3,l2],[u2,v1,u22,v]],
    [[t0,l0,l3,t3],[u,v1,u1,v2]],[[t1,t0,t3,t2],[u1,v1,u2,v2]],
    [[l1,t1,t2,l2],[u2,v1,u3,v2]],[[l0,l1,l2,l3],[u3,v1,u4,v2]],
  ];
  const positions=[],uvs=[];
  for(let [vertices,[a,b,e,f]] of quads){
    let uv=[[e/tw,1-b/th],[a/tw,1-b/th],[a/tw,1-f/th],[e/tw,1-f/th]];
    if(c.mirror){vertices=vertices.toReversed();uv=uv.toReversed();}
    for(const i of [0,1,2,0,2,3]){positions.push(...vertices[i]);uvs.push(...uv[i]);}
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.computeVertexNormals();return geometry;
}
async function dog(model,texturePath,x,z){
  const texture=await new THREE.TextureLoader().loadAsync(texturePath);texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.NearestFilter;texture.generateMipmaps=false;texture.colorSpace=THREE.SRGBColorSpace;
  const material=new THREE.MeshStandardMaterial({map:texture,roughness:1,side:THREE.DoubleSide});
  function part(p){const group=new THREE.Group();group.position.set(...p.pivot);group.rotation.set(...(p.rotation||[0,0,0]));for(const c of p.cubes||[]){const mesh=new THREE.Mesh(cubeGeometry(c,...model.size),material);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);}for(const child of p.children||[])group.add(part(child));return group;}
  const root=new THREE.Group();root.position.set(x,24,z);root.scale.set(1,-1,-1);for(const p of model.parts)root.add(part(p));scene.add(root);
}
await Promise.all([dog(adult,'../source/floofy-adult.png',-6,-2),dog(baby,'../source/floofy-baby.png',9,5)]);
function resize(){renderer.setSize(stage.clientWidth,stage.clientHeight);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(stage);resize();
document.querySelector('#front').onclick=()=>{camera.position.set(0,20,65);controls.target.set(0,9,0);};
document.querySelector('#side').onclick=()=>{camera.position.set(65,22,0);controls.target.set(0,9,0);};
document.querySelector('#spin').onclick=e=>{controls.autoRotate=!controls.autoRotate;e.currentTarget.setAttribute('aria-pressed',String(controls.autoRotate));};
window.floofyReady=true;
renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});
