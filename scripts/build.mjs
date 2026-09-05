import sharp from 'sharp';
import {mkdir,writeFile,copyFile} from 'node:fs/promises';
import {adult,baby,faces,allCubes} from '../source/models.mjs';

const root=new URL('../',import.meta.url);
const path=p=>new URL(p,root).pathname;
const artwork=path('source/floofy-adult-original.png');
const scale=4;
// Rectangles in the generated artwork. Repack these painted surfaces into the
// exact game UV layout; generative artwork alone is not a game-ready UV map.
const regions={
  black:[493,500,230,150], brown:[36,709,152,52], cream:[893,55,73,79],
  face:[112,112,302,250], headTop:[112,0,302,112],
  cheek:[15,112,95,220], nose:[166,264,179,121],
  innerEar:[470,369,58,80], bib:[777,0,245,190],
  leg:[16,519,109,304], side:[493,500,230,290],
  bellySide:[876,490,60,260],
};
async function patch(region,w,h) {
  if(region==='bellyLeft'||region==='bellyRight') {
    const [left,top,width,height]=regions.bellySide;
    const resized=await sharp(artwork).extract({left,top,width,height})
      .resize(h,w,{fit:'fill',kernel:'nearest'}).png().toBuffer();
    return sharp(resized).rotate(region==='bellyLeft'?270:90).png().toBuffer();
  }
  const [left,top,width,height]=regions[region];
  return sharp(artwork).extract({left,top,width,height}).resize(w,h,{fit:'fill',kernel:'nearest'}).png().toBuffer();
}
function skinFor(skin,face) {
  const maps={
    head:{front:'face',top:'headTop',bottom:'cream',left:'cheek',right:'cheek'},
    muzzle:{front:'nose',top:'cream',bottom:'cream',left:'cream',right:'cream',back:'cream'},
    ear:{front:'innerEar'},
    body:{left:'bellyLeft',right:'bellyRight',front:'cream'},
    ruff:{top:'bib',front:'cream'},
    babyBody:{front:'bib',bottom:'cream',left:'side',right:'side'},
    leg:{top:'black',bottom:'brown',left:'leg',right:'leg',front:'leg',back:'leg'},
    tail:{},
  };
  return maps[skin]?.[face]||'black';
}
async function atlas(model,name) {
  const layers=[], seen=new Set();
  for(const cube of allCubes(model)) {
    for(const [face,[x,y,w,h]] of Object.entries(faces(cube))) {
      const key=[x,y,w,h].join(',');
      if(seen.has(key)) continue;
      seen.add(key);
      layers.push({input:await patch(skinFor(cube.skin,face),w*scale,h*scale),left:x*scale,top:y*scale});
    }
  }
  await sharp({create:{width:model.size[0]*scale,height:model.size[1]*scale,channels:4,background:'#191716'}})
    .composite(layers).png().toFile(path(`source/floofy-${name}.png`));
}
await atlas(adult,'adult');
await atlas(baby,'baby');
const pack=path('dist/Floofy-26.1');
const entity=pack+'/assets/minecraft/optifine/random/entity/wolf';
await mkdir(entity,{recursive:true});
await writeFile(pack+'/pack.mcmeta',JSON.stringify({pack:{description:'Floofy • Your little mountain dog\nName a wolf Floofy • Requires ETF',min_format:[84,0],max_format:[84,0]}},null,2)+'\n');
const variants=['','_ashen','_black','_chestnut','_rusty','_snowy','_spotted','_striped','_woods'];
const stems=[];
for(const variant of variants) for(const state of ['','_tame','_angry']) for(const age of ['','_baby']) {
  const stem='wolf'+variant+state+age;
  stems.push(stem);
  await copyFile(path(`source/floofy-${age?'baby':'adult'}.png`),`${entity}/${stem}2.png`);
  await writeFile(`${entity}/${stem}.properties`,[
    '# Floofy: exact name, ignoring capitalization. Texture 1 is vanilla.',
    'skins.1=2','name.1=ipattern:Floofy','','skins.2=1',''
  ].join('\n'));
}
// Keep the dyeable vanilla collar layer. Only the named wolf's fur changes.
await sharp(artwork).extract({left:111,top:0,width:306,height:389})
  .resize(256,256,{fit:'contain',background:'#24201b',kernel:'nearest'}).png().toFile(pack+'/pack.png');
await copyFile(path('README.md'),pack+'/README.txt');
await writeFile(path('source/coverage.json'),JSON.stringify({minecraft:'26.1',format:[84,0],scale,textureStems:stems},null,2)+'\n');
console.log(`Built Floofy: ${stems.length} named-wolf texture rules (all 9 variants × 3 states × 2 ages).`);
