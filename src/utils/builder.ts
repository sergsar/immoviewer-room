import {
    BackSide,
    Mesh,
    ShaderMaterial,
    TextureLoader,
    Vector3
} from 'three'
import {ThreeDeeData} from '../contracts/three-dee-data';
import {WORLD_MLT} from '../consts/multipliers';
import {IRoom} from '../models/room';
import {ContentData, Tour, TourRooms} from '../contracts/content-data';
import {FRAGMENT_EQ_SHADER, VERTEX_EQ_SHADER} from '../consts/shaders';
import {buildGeometry} from './geometry-builder';

export const buildRooms = (
    { rooms = [], cameras }: ThreeDeeData,
    { tour: { rooms: tourRooms = {} as TourRooms } = {} as Tour }: ContentData
): IRoom[] => {
    const textureLoader = new TextureLoader()
    textureLoader.crossOrigin = 'Anonymous'

    return rooms.map(({ corners, interiorCorners, roomName }, index): IRoom|null => {
        const roomsContent = Object.values(tourRooms)
        const camera = cameras.find((item) => item.roomName === roomName)
        const mapUrl = roomsContent.find((item) => item.name === roomName)?.url

        if (!(camera && mapUrl)) {
            console.error(`insufficient data for room ${roomName}`)
            return null
        }
        const map = textureLoader.load(mapUrl)
        const cameraPos = new Vector3(camera.y, 0, camera.x)
            .multiplyScalar(WORLD_MLT)
            .multiplyScalar(-1)

        const material = new ShaderMaterial({
            uniforms: {
                map: { value: map },
                center: { value: cameraPos },
                angle: { value: camera.mergeAngle * Math.PI / 180.0 }
            },
            vertexShader: VERTEX_EQ_SHADER,
            fragmentShader: FRAGMENT_EQ_SHADER,
            side: BackSide,
            transparent: true
        })

        const geometry = buildGeometry({
            points: interiorCorners.map(({ x, y }) => ({ x: y * WORLD_MLT, z: x * WORLD_MLT })),
            height: 3,
            flip: false
        })

        const mesh = new Mesh(geometry, material)

        return {
            object: mesh,
            name: roomName,
            camera: {
                position: cameraPos
            }
        }
    }).filter(Boolean) as IRoom[]

}
