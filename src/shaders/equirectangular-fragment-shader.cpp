
uniform sampler2D map;
uniform float angle;

varying vec2 vUv;
varying vec3 vPosition;

const float PI = 3.141592653589793;

void main() {
    float sine = sin(angle);
    float cosine = cos(angle);
    vec3 positionRotate = vec3(
        vPosition.x * cosine - vPosition.z * sine,
        vPosition.y,
        vPosition.x * sine + vPosition.z * cosine
    );

    vec3 direction = normalize(positionRotate);
    vec2 sampleUV = vec2(
        (atan(direction.z, direction.x) / PI + 1.0) * 0.5,
        asin(direction.y) / PI + 0.5
    );

    gl_FragColor = texture2D(map, sampleUV);

}
