var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// shader
var vertShader = `
void main() {
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}`
var fragShaders = {
  1: `
    uniform float time;
    uniform vec2 resolution;

    vec2 rand(vec2 pos) { return fract((pow(pos + 2.0, pos.yx + 2.0) * 555555.0)); }

    vec2 rand2(vec2 pos) { return rand(rand(pos)); }

    float softnoise(vec2 pos, float scale) {
      vec2 smplpos = pos * scale;
      float c0 = rand2((floor(smplpos) + vec2(0.0, 0.0)) / scale).x;
      float c1 = rand2((floor(smplpos) + vec2(1.0, 0.0)) / scale).x;
      float c2 = rand2((floor(smplpos) + vec2(0.0, 1.0)) / scale).x;
      float c3 = rand2((floor(smplpos) + vec2(1.0, 1.0)) / scale).x;

      vec2 a = fract(smplpos);
      return mix(mix(c0, c1, smoothstep(0.0, 1.0, a.x)),
                mix(c2, c3, smoothstep(0.0, 1.0, a.x)), smoothstep(0.0, 1.0, a.x));
    }

    void main(void) {
      vec2 pos = gl_FragCoord.xy / resolution.y - time * 0.4;

      float color = 0.0;
      float s = 1.0;
      for (int i = 0; i < 6; ++i) {
        color += softnoise(pos + vec2(0.01 * float(i)), s * 4.0) / s / 2.0;
        s *= 2.0;
      }
      gl_FragColor = vec4(color, mix(color, cos(color), sin(color)), color, 1);
    }`,
  2: `
    uniform float time;
    uniform vec2 resolution;
    
    #define speed 40.0
    #define freq 1.0
    #define amp 0.2
    #define phase 5.0
    
    void main(void) {
      vec2 p = (gl_FragCoord.xy / resolution.xy) - 0.4;
      float sx = (amp)*6.8 * sin(6.0 * (freq) * (p.x - phase) - 5.8 * (speed)*time);
      float dy = 12. / (9. * abs(4.9 * p.y - sx - 1.2));
      // dy += 1./ (60. * length(p - vec2(p.x, 0.)));
      gl_FragColor = vec4((p.x + 5.9) * dy, 0.3 * dy, dy, 2.0);
    }`,
  3: `
    uniform float time;
    uniform vec2 resolution;

    void main(void) {
      vec2 uPos = (gl_FragCoord.xy / resolution.xy);  // normalize wrt y axis
      // suPos -= vec2((resolution.x/resolution.y)/2.0, 0.0);//shift origin to
      // center

      uPos.x -= 1.0;
      uPos.y -= 0.5;

      vec3 color = vec3(0.0);
      float vertColor = 2.0;
      for (float i = 0.0; i < 15.0; ++i) {
        float t = time * (0.9);

        uPos.y += sin(uPos.x * i + t + i / 2.0) * 0.1;
        float fTemp = abs(1.0 / uPos.y / 100.0);
        vertColor += fTemp;
        color += vec3(fTemp * (10.0 - i) / 10.0, fTemp * i / 10.0,
                      pow(fTemp, 1.5) * 1.5);
      }

      vec4 color_final = vec4(color, 1.0);
      gl_FragColor = color_final;
    }`}

function createMaterial(thisFragShader) {
  var attributes = {};
  var uniforms = {
    time: { type: 'f', value: 0.2 },
    scale: { type: 'f', value: 0.2 },
    alpha: { type: 'f', value: 0.6 },
    resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  };

  var meshMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    defaultAttributeValues: attributes,
    vertexShader: vertShader,
    fragmentShader: thisFragShader,
    transparent: true
  });

  return meshMaterial;
}

// sphere
shaderChoice = 1;
sphere = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 32), createMaterial(fragShaders[shaderChoice]));
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

// listen 'S' key
document.onkeypress = (event) => {
  if (event.key == 's') {
    sphere.material = createMaterial(fragShaders[(++shaderChoice)%3]);
    sphere.material.needsUpdate = true;
  }
}