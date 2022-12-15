export const VERTEX_EQ_SHADER = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    
    void main() {
    
        vUv = uv;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        vPosition = position;
    }
`

export const FRAGMENT_EQ_SHADER = `

    uniform sampler2D map;
    uniform mat4 transform;

    varying vec2 vUv;
    varying vec3 vPosition;

    const float PI = 3.141592653589793;

    void main() {
        float x = vPosition.x;
        float y = vPosition.y;
        float z = vPosition.z;
        float a = sqrt(1.0/(x * x +y * y + z * z));
        x = a*x;
        y = a*y;
        z = a*z;
        

        vec3 positionN = normalize(vPosition);

        vec2 sampleUV = vec2(
            (atan(z, x) / PI + 1.0) * 0.5,
            asin(y) / PI + 0.5
        );

        gl_FragColor = texture2D(map, sampleUV);

    }
`
