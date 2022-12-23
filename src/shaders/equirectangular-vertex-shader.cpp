uniform vec3 center;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;


void main() {

    vUv = uv;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vPosition = position + center;
}
