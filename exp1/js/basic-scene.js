import * as THREE from 'three.min.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// light
const pointLight = new THREE.PointLight(0xFFFFFF); pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;
scene.add(pointLight);

function createMaterial(thisFragShader) {
  var meshMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: {type: 'v3', value: new THREE.Color('#60371b')},
      light: {type: 'v3', value: pointLight.position},
    },
    vertexShader: document.getElementById("basic-vs"),
    fragmentShader: thisFragShader,
    transparent: true
  });

  return meshMaterial;
}

// sphere
// shaderChoice = 1;
sphere = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 32), createMaterial(document.getElementById("basic-fs")));
sphere.position.z = -300;
scene.add(sphere);

// loop
function update() {
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);

// listen 'S' key
// document.onkeypress = (event) => {
//   if (event.key == 's') {
//     sphere.material = createMaterial(fragShaders[(++shaderChoice) % 3]);
//     sphere.material.needsUpdate = true;
//   }
// }