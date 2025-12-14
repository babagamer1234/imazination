let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for(let i=0;i<particleCount;i++){
  positions[i*3] = (Math.random()-0.5)*10;
  positions[i*3+1] = (Math.random()-0.5)*10;
  positions[i*3+2] = (Math.random()-0.5)*10;

  colors[i*3] = Math.random();
  colors[i*3+1] = Math.random();
  colors[i*3+2] = Math.random();
}

let geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors,3));

let material = new THREE.PointsMaterial({size:0.1, vertexColors:true, transparent:true, opacity:0.8});
let particles = new THREE.Points(geometry, material);
scene.add(particles);

function updateParticles(handPos){
  for(let i=0;i<particleCount;i++){
    let dx = positions[i*3] - handPos[0]/100;
    let dy = positions[i*3+1] - handPos[1]/100;
    let dz = positions[i*3+2] - handPos[2]/100;
    let dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

    positions[i*3] += dx/dist*0.01;
    positions[i*3+1] += dy/dist*0.01;
    positions[i*3+2] += dz/dist*0.01;

    colors[i*3] = Math.min(1,dist);
    colors[i*3+1] = Math.max(0,1-dist);
    colors[i*3+2] = Math.random();
  }
  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.color.needsUpdate = true;
}

function animate(){
  requestAnimationFrame(animate);
  particles.rotation.y += 0.001;
  renderer.render(scene, camera);
}

animate();
detectHands(updateParticles);
