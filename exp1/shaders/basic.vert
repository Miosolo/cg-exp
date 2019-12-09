// passed from param
uniform vec3 color;
uniform vec3 light;
// pass to fs
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vLight;

void main() {
  vColor = color;
  // normal vector
  vNormal = normalize(normalMatrix * normal);
  
  vec4 viewLight = modelViewMatrix * vec4(light, 1.0);
  vLight = viewLight.xyz;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}