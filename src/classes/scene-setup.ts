import {
  AmbientLight,
  Color,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { TOP_VIEW } from '../consts/names'
import { IFlat } from '../models/room'
import { Animator } from './animator'

export class SceneSetup {
  private readonly resizeBind: () => void
  private readonly camera: PerspectiveCamera
  private readonly renderer: WebGLRenderer
  private readonly scene: Scene
  private readonly controls: OrbitControls

  private readonly animator: Animator = new Animator()

  private center?: Vector3

  private flat?: IFlat

  constructor(private canvas: HTMLCanvasElement) {
    this.camera = new PerspectiveCamera(
      36,
      window.innerWidth / window.innerHeight,
      0.25,
      160
    )
    this.camera.position.set(0, 1, 0)
    this.camera.near = 0.05
    this.camera.far = 100
    this.scene = new Scene()
    this.scene.background = new Color(0x000000)
    this.scene.add(new AmbientLight(0x505050))
    const dirLight = new DirectionalLight(0x55505a, 1)
    dirLight.position.set(10, 10, 10)
    dirLight.rotation.set(45, 0, 0)

    this.scene.add(dirLight)

    this.renderer = new WebGLRenderer({ canvas })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.resizeBind = this.onWindowResize.bind(this)
    window.addEventListener('resize', this.resizeBind)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.maxDistance = 30

    this.animator.callback = this.animate.bind(this)
    this.animator.start()
  }

  public dispose() {
    this.animator.stop()
    window.removeEventListener('resize', this.resizeBind)
    this.renderer.dispose()
  }

  public switchCamera(name: string) {
    const { camera, controls, center = new Vector3(), flat } = this
    if (name === TOP_VIEW) {
      camera.setFocalLength(45)
      camera.position.copy(center).add(new Vector3(15, 15, 15))
      controls.rotateSpeed = 1
      controls.minDistance = 20
      controls.target.copy(center)
      controls.enableZoom = true
      controls.update()
      return
    }
    const selectedRoom = flat?.rooms.find((item) => item.name === name)
    if (!selectedRoom) {
      return
    }
    camera.setFocalLength(20)
    const cameraPos = selectedRoom.camera.position
    camera.position.copy(cameraPos).add(new Vector3(0.1, 0.1, 0.1))
    controls.rotateSpeed = 2
    controls.minDistance = 0
    controls.target.copy(cameraPos)
    controls.enableZoom = false
    controls.update()
  }

  public setFlat(flat: IFlat) {
    if (this.flat) {
      this.flat.rooms.forEach(({ object }) => this.scene.remove(object))
      this.flat.exterior.forEach((item) => this.scene.remove(item))
    }

    this.scene.add(...flat.rooms.map((item) => item.object))
    this.scene.add(...flat.exterior)

    this.center = flat.rooms.reduce(
      (acc, curr) => acc.add(curr.camera.position),
      new Vector3(0, 0, 0)
    )
    this.center.divideScalar(flat.rooms.length || 1)

    this.flat = flat
  }

  private animate() {
    this.renderer.render(this.scene, this.camera)
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
