import {
    AmbientLight, Color,
    DirectionalLight,
    PerspectiveCamera,
    Scene, Vector3,
    WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {IThreeSetup} from '../models/three-setup';
import {IFlat} from '../models/room';

export const initThreeScene = (
    canvas: HTMLCanvasElement,
    flat: IFlat,
    activeRoom: string
): IThreeSetup => {

    const camera = new PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.25, 160)
    camera.position.set(0, 1, 0)
    camera.near = 0.05
    camera.far = 100
    const scene = new Scene()
    scene.background = new Color(0x000000)
    scene.add(new AmbientLight(0x505050))
    const dirLight = new DirectionalLight(0x55505a, 1)
    dirLight.position.set(10, 10, 10)
    dirLight.rotation.set(45, 0 ,0)

    scene.add(dirLight)


    // Objects
    scene.add(...flat.rooms.map((item) => item.object))
    scene.add(...flat.exterior)

    // Renderer

    const renderer = new WebGLRenderer({ canvas })
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, window.innerHeight )
    window.addEventListener( 'resize', () => onWindowResize(camera, renderer) )

    // Controls

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.maxDistance = 30

    const center = flat.rooms.reduce((acc, curr) => acc.sub(curr.camera.position), new Vector3(0, 0, 0))
    center.divideScalar(flat.rooms.length || 1)

    const onChangeRoom = (name: string) => {
        if (name === 'Top') {
            camera.setFocalLength(45)
            camera.position.copy(center).add(new Vector3(15, 15, 15))
            controls.rotateSpeed = 1
            controls.minDistance = 20
            controls.target.copy(center)
            controls.enableZoom = true
            controls.update()
            return
        }
        const selectedRoom = flat.rooms.find((item) => item.name === name)
        if (!selectedRoom) {
            return
        }
        camera.setFocalLength(20)
        const cameraPos = selectedRoom.camera.position.clone().multiplyScalar(-1)
        camera.position.copy(cameraPos).add(new Vector3(0.1, 0.1, 0.1))
        controls.rotateSpeed = 2
        controls.minDistance = 0
        controls.target.copy(cameraPos)
        controls.enableZoom = false
        controls.update()
    }

    const onDispose = () => renderer.dispose()

    const onAnimate = () => renderer.render(scene, camera)

    onChangeRoom(activeRoom)

    return {
        animate: onAnimate,
        changeRoom: onChangeRoom,
        dispose: onDispose
    }
}

const onWindowResize = (camera: PerspectiveCamera, renderer: WebGLRenderer) => {

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize( window.innerWidth, window.innerHeight )

}

// const onChangeCamera =