import {
  BackSide,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  ShaderMaterial,
  TextureLoader,
  Vector3,
} from 'three'

import { WORLD_MLT } from '../consts/multipliers'
import { ContentData, Tour, TourRooms } from '../contracts/content-data'
import { ThreeDeeData } from '../contracts/three-dee-data'
import { Point } from '../models/geometry-builder'
import { IFlat, IRoom } from '../models/room'
import equirectangularFragmentShader from '../shaders/equirectangular-fragment-shader.cpp'
import equirectangularVertexShader from '../shaders/equirectangular-vertex-shader.cpp'
import { buildExteriorGeometry, buildGeometry } from './geometry-builder'

export const buildFlat = (
  { rooms: roomsData = [], cameras }: ThreeDeeData,
  { tour: { rooms: tourRooms = {} as TourRooms } = {} as Tour }: ContentData,
): IFlat => {
  const textureLoader = new TextureLoader()
  textureLoader.crossOrigin = 'Anonymous'
  const rooms: IRoom[] = []
  const exterior: Object3D[] = []
  const exteriorMaterial = new MeshPhongMaterial({
    color: 'rgb(85, 85, 85)',
    specular: 30,
    transparent: true,
    opacity: 0.85,
  })

  roomsData.forEach(({ corners, interiorCorners, roomName }) => {
    const roomsContent = Object.values(tourRooms)
    const camera = cameras.find((item) => item.roomName === roomName)
    const mapUrl = roomsContent.find((item) => item.name === roomName)?.url
    const interiorPoints = getPoints(interiorCorners)
    const exteriorPoints = getPoints(corners)

    if (!(camera && mapUrl)) {
      // Skip item
      console.error(`insufficient data for room ${roomName}`)
      return
    }
    const map = textureLoader.load(mapUrl)
    const cameraPos = new Vector3(camera.y, 0, camera.x)
      .multiplyScalar(WORLD_MLT)
      .multiplyScalar(-1)

    const material = new ShaderMaterial({
      uniforms: {
        map: { value: map },
        center: { value: cameraPos },
        angle: { value: (camera.mergeAngle * Math.PI) / 180.0 },
      },
      vertexShader: equirectangularVertexShader,
      fragmentShader: equirectangularFragmentShader,
      side: BackSide,
      transparent: true,
    })

    const geometry = buildGeometry({
      points: interiorPoints,
      height: 3,
      flip: false,
    })

    const mesh = new Mesh(geometry, material)

    rooms.push({
      object: mesh,
      name: roomName,
      camera: {
        position: cameraPos,
      },
    })

    const exteriorGeometry = buildExteriorGeometry({
      points: exteriorPoints,
      interiorPoints,
      height: 3,
      flip: false,
    })
    const exteriorMesh = new Mesh(exteriorGeometry, exteriorMaterial)

    exterior.push(exteriorMesh)
  })

  return {
    rooms,
    exterior,
  }
}

const getPoints = (corners: Array<{ x: number; y: number }>): Point[] => {
  return corners.map(({ x, y }) => ({ x: y * WORLD_MLT, z: x * WORLD_MLT }))
}
