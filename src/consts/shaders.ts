export const VERTEX_EQ_SHADER = `
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
`

export const FRAGMENT_EQ_SHADER = `

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
            (atan(direction.x, direction.z) / PI + 1.0) * 0.5,
            asin(direction.y) / PI + 0.5
        );

        gl_FragColor = texture2D(map, sampleUV);

    }
`
