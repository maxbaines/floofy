// Cube dimensions, pivots and UV offsets verified against the Java 26.1 client.
// Minecraft coordinates: X right, Y down, Z toward the tail.
export const adult = {
  size: [64, 32],
  parts: [
    {name:'head', pivot:[-1,13.5,-7], cubes:[
      {skin:'head', uv:[0,0], box:[-2,-3,-2,6,6,4]},
      {skin:'ear', uv:[16,14], box:[-2,-5,0,2,2,1]},
      {skin:'ear', uv:[16,14], box:[2,-5,0,2,2,1]},
      {skin:'muzzle', uv:[0,10], box:[-.5,-.001,-5,3,3,4]},
    ]},
    {name:'body', pivot:[0,14,2], rotation:[Math.PI/2,0,0], cubes:[{skin:'body',uv:[18,14],box:[-3,-2,-3,6,9,6]}]},
    {name:'ruff', pivot:[-1,14,-3], rotation:[Math.PI/2,0,0], cubes:[{skin:'ruff',uv:[21,0],box:[-3,-3,-3,8,6,7]}]},
    ...[[-2.5,16,7],[.5,16,7],[-2.5,16,-4],[.5,16,-4]].map((pivot,i)=>({name:'leg'+i,pivot,cubes:[{skin:'leg',uv:[0,18],box:[0,0,-1,2,8,2],mirror:i%2===0}]})),
    {name:'tail',pivot:[-1,12,8],rotation:[.85,0,0],cubes:[{skin:'tail',uv:[9,18],box:[0,0,-1,2,8,2]}]},
  ]
};
export const baby = {
  size:[32,32],
  parts:[
    {name:'head',pivot:[0,18.25,-4],cubes:[
      {skin:'head',uv:[0,12],box:[-2.99,-3.25,-3,6,5,5],inflate:.025},
      {skin:'muzzle',uv:[17,12],box:[-1.5,-.24,-5,3,2,2]},
      {skin:'ear',uv:[0,5],box:[-3,-5.25,-1,2,2,1]},
      {skin:'ear',uv:[20,5],box:[1,-5.25,-1,2,2,1]},
    ]},
    {name:'body',pivot:[0,19,0],cubes:[{skin:'babyBody',uv:[0,0],box:[-3,-2,-4,6,4,8]}]},
    ...[[[-1.5,21,3],[0,22]],[[1.5,21,3],[8,22]],[[-1.5,21,-3],[0,0]],[[1.5,21,-3],[20,0]]].map(([pivot,uv],i)=>({name:'leg'+i,pivot,cubes:[{skin:'leg',uv,box:[-1,0,-1,2,3,2]}]})),
    {name:'tail',pivot:[0,19,3],rotation:[-.5236,0,0],children:[{name:'tailTip',pivot:[0,-.6,.2],rotation:[-3.1,0,0],cubes:[{skin:'tail',uv:[22,16],box:[-1,-5.7,-1,2,6,2]}]}]},
  ]
};

export function faces(cube) {
  const [u,v]=cube.uv, [,,,w,h,d]=cube.box;
  return {
    top:[u+d,v,w,d], bottom:[u+d+w,v,w,d],
    left:[u,v+d,d,h], front:[u+d,v+d,w,h],
    right:[u+d+w,v+d,d,h], back:[u+2*d+w,v+d,w,h],
  };
}

export function allCubes(model) {
  const walk=parts=>parts.flatMap(p=>[...(p.cubes||[]),...walk(p.children||[])]);
  return walk(model.parts);
}
