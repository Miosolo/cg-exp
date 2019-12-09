varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vLight;

void main() {
  float diffuse = dot(normalize(vLight), vNormal);
  gl_FragColor = vec4(vColor * diffuse, 1.0);
}