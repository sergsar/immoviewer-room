import {
    AmbientLight,
    DirectionalLight,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {IThreeSetup} from '../models/three-setup';
import {IRoom} from '../models/room';

export const animateScene = ({ renderer, scene, camera }: IThreeSetup): void => {
    renderer.render(scene, camera)
}

export const initThreeScene = (
    canvas: HTMLCanvasElement,
    rooms: IRoom[],
    activeRoom: string
): IThreeSetup => {

    const camera = new PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.25, 160)
    camera.position.set(0, 1, 0)
    const scene = new Scene()

    scene.add(new AmbientLight(0x505050))
    const dirLight = new DirectionalLight(0x55505a, 1)
    dirLight.position.set(0, 0, 0)

    scene.add(dirLight)


    // Objects
    scene.add(...rooms.map((item) => item.object))

    // Renderer

    const renderer = new WebGLRenderer({ canvas })
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, window.innerHeight )
    window.addEventListener( 'resize', () => onWindowResize(camera, renderer) )

    // Controls

    const controls = new OrbitControls(camera, renderer.domElement)

    const onChangeRoom = (name: string) => {
        const selectedRoom = rooms.find((item) => item.name === name)
        if (!selectedRoom) {
            return
        }
        if (selectedRoom.name === activeRoom) {
            return
        }

        const cameraPos = selectedRoom.camera.position
        controls.target = cameraPos.clone().multiplyScalar(-1)
        controls.zoomO = 0
        controls.enableZoom = false
        controls.update()
    }

    onChangeRoom(activeRoom)

    return {
        camera,
        scene,
        renderer,
        changeRoom: onChangeRoom
    }
}

const onWindowResize = (camera: PerspectiveCamera, renderer: WebGLRenderer) => {

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize( window.innerWidth, window.innerHeight )

}

// const onChangeCamera =