import React, {useEffect, useMemo, useRef, useState} from 'react'
import './App.css'
import { useData } from './hooks/useData'
import {
  AmbientLight, Camera,
  DirectionalLight, DoubleSide, Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  TorusKnotGeometry,
  WebGLRenderer
} from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

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

const init = (canvas: HTMLCanvasElement|null) => {
  if (!canvas) {
    return null
  }
  const camera = new PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.25, 16)
  camera.position.set( 0, 1.3, 3 )
  const scene = new Scene()
  scene.add(new AmbientLight(0x505050))

  const dirLight = new DirectionalLight( 0x55505a, 1)
  dirLight.position.set(0, 3, 0)

  scene.add(dirLight)

  // Geometry

  const material = new MeshPhongMaterial({
    color: 0x80ee10,
    shininess: 100,
    side: DoubleSide,
  })

  const geometry = new TorusKnotGeometry( 0.4, 0.08, 95, 20)

  const object = new Mesh(geometry, material)
  object.castShadow = true
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
  controls.target.set( 0, 1, 0 )
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

  const data2 = useData({ name: '2' })
  console.log('data2: ', data2)

  const { current: canvas } = canvasRef
  console.log('canvas: ', canvas)
  const threeInitialised = useMemo(() => init(canvas), [canvas])

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
