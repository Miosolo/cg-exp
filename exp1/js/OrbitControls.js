var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// sphere
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
const sphere = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 32), sphereMaterial);
sphere.position.z = -300;
scene.add(sphere);

// light
const pointLight = new THREE.PointLight(0xFFFFFF); pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;
scene.add(pointLight);

// loop
function update() {
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);