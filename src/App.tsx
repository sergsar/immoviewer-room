import React, {useEffect, useMemo, useRef, useState} from 'react'
import './App.css'
import { useData } from './hooks/useData'
import {
  AmbientLight,
  BackSide, BoxGeometry, BufferGeometry, Camera, DirectionalLight,
  Matrix4, Mesh, MeshBasicMaterial, MeshPhongMaterial, MeshStandardMaterial,
  PerspectiveCamera,
  Scene, ShaderMaterial, TextureLoader, Vector3,
  WebGLRenderer
} from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {FRAGMENT_EQ_SHADER, VERTEX_EQ_SHADER} from './consts/shaders'
import TestEnv from './assets/testEnv.jpeg'
import {ThreeDeeData} from './contracts/ThreeDeeData'
import {build} from './utils/builder';
import {WORLD_MLT} from './consts/multipliers';

interface IThreeInitializedObject {
  renderer: WebGLRenderer, scene: Scene, camera: Camera
}

const onWindowResize = (camera: PerspectiveCamera, renderer: WebGLRenderer) => {

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize( window.innerWidth, window.innerHeight )

}

const animate = (
    object: IThreeInitializedObject,
    { renderer, scene, camera } = object
) => {
  requestAnimationFrame( () => animate(object))
  renderer.render(scene, camera)
}

const init = (canvas: HTMLCanvasElement|null, geometry: BufferGeometry) => {
  if (!(canvas && geometry)) {
    return null
  }
  const textureLoader = new TextureLoader()

  const cameraPos = new Vector3(-260.2992 * WORLD_MLT, 0, 165.81119999999999 * WORLD_MLT)

  const camera = new PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.25, 160)
  camera.position.set(0, 1, 0)
  const scene = new Scene()

  scene.add(new AmbientLight(0x505050))
  const dirLight = new DirectionalLight(0x55505a, 1)
  dirLight.position.set(0, 0, 0)

  scene.add(dirLight)


  // Geometry

  const material = new ShaderMaterial( {
    uniforms: {
      map: { value: textureLoader.load(TestEnv) },
      center: { value: cameraPos },
      angle: { value: 5 * Math.PI / 180.0 }
    },
    vertexShader: VERTEX_EQ_SHADER,
    fragmentShader: FRAGMENT_EQ_SHADER,
    side: BackSide,
    transparent: true
  } )

  const object = new Mesh(geometry, material)
  scene.add(object)

  // Renderer

  const renderer = new WebGLRenderer({ canvas })
  renderer.shadowMap.enabled = true
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )
  window.addEventListener( 'resize', () => onWindowResize(camera, renderer) )

  // renderer.clippingPlanes = Object.freeze([]) // GUI sets it to globalPlanes
  renderer.localClippingEnabled = true

  // Controls

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target = cameraPos.clone().multiplyScalar(-1)
  controls.update()

  return {
    camera,
    scene,
    object,
    renderer
  }
}

function App() {
  const [animationState, setAnimationState] = useState(false)
  const canvasRef = useRef(null)
  const data1 = useData({ name: '1' })
  console.log('data1: ', data1)

  const data2 = useData<ThreeDeeData>({ name: '2' })
  console.log('data2: ', data2)
  const { data: { rooms: [bedroom, living] = [] }  } = data2
  const geometry = useMemo(() => build({
    points: living?.corners.map(({ x, y }) => ({ x: y * WORLD_MLT, z: x * WORLD_MLT })) || [],
    height: 3,
    flip: false
  }), [living])
  console.log('geometry: ', geometry)

  const { current: canvas } = canvasRef
  console.log('canvas: ', canvas)
  const threeInitialised = useMemo(() => init(canvas, geometry), [canvas])

  useEffect(() => {
    if (animationState) {
      console.log('already animated')
      return
    }
    console.log('about animate')
    if (threeInitialised) {
      console.log('animating scene')
      animate(threeInitialised)
      setAnimationState(true)
    }
  }, [threeInitialised, animationState])

  console.log('threeInitialised: ', threeInitialised)

  return (
    <div className="App">
      <canvas ref={canvasRef}/>
    </div>
  )
}

export default App
