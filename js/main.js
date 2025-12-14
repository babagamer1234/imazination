// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Particles
const particleCount = 1000;
const positions = new Float32Array(particleCount*3);
const colors = new Float32Array(particleCount*3);

for(let i=0;i<particleCount;i++){
  positions[i*3] = (Math.random()-0.5)*10;
  positions[i*3+1] = (Math.random()-0.5)*10;
  positions[i*3+2] = (Math.random()-0.5)*10;

  colors[i*3] = Math.random();
  colors[i*3+1] = Math.random();
  colors[i*3+2] = Math.random();
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors,3));

const material = new THREE.PointsMaterial({
  size: 0.2,
  vertexColors: true,
  transparent: true,
  opacity: 0.8
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Load textures from your links (downloaded as PNGs in textures/)
const textureLoader = new THREE.TextureLoader();
const textures = {
  heart: textureLoader.load('textures/heart.png'),
  flower: textureLoader.load('textures/flower.png'),
  saturn: textureLoader.load('textures/saturn.png'),
  firework: textureLoader.load('textures/firework.png')
};

let currentTemplate = 'heart';
material.map = textures[currentTemplate];
material.alphaTest = 0.5;

// Switch templates with keys
function switchTemplate(name){
  if(textures[name]){
    currentTemplate = name;
    material.map = textures[currentTemplate];
  }
}

window.addEventListener('keydown', e=>{
  if(e.key==='1') switchTemplate('heart');
  if(e.key==='2') switchTemplate('flower');
  if(e.key==='3') switchTemplate('saturn');
  if(e.key==='4') switchTemplate('firework');
});

// Particle update based on hand position
function updateParticles(handPos){
  for(let i=0;i<particleCount;i++){
    let dx = positions[i*3] - handPos[0]/100;
    let dy = positions[i*3+1] - handPos[1]/100;
    let dz = positions[i*3+2] - handPos[2]/100;
    let dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

    positions[i*3] += dx/dist * 0.02;
    positions[i*3+1] += dy/dist * 0.02;
    positions[i*3+2] += dz/dist * 0.02;

    colors[i*3] = Math.min(1, dist);
    colors[i*3+1] = Math.max(0, 1-dist);
    colors[i*3+2] = Math.random();
  }
  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.color.needsUpdate = true;
}

// Animate scene
function animate(){
  requestAnimationFrame(animate);
  particles.rotation.y += 0.001;
  renderer.render(scene, camera);
}

animate();
detectHands(updateParticles);
