import {BufferGeometry, Float32BufferAttribute, Vector3} from 'three';

interface IGeometryBuilderParams {
    points: Point[]
    height: number
    flip?: boolean
}

interface Point {
    x: number
    z: number
}

export const buildGeometry = ({ points, height, flip }: IGeometryBuilderParams): BufferGeometry => {
    const geometry = new BufferGeometry()
    const positions = []
    const top = height * 0.5
    const bottom = -height * 0.5

    const vertical = getVertical(points, top, bottom, flip)
    const horizontalTop = getHorizontal(points, top, flip)
    const horizontalBottom = getHorizontal(points, bottom, !flip)

    positions.push(...vertical, ...horizontalTop, ...horizontalBottom)

    const normals = buildNormals(positions)

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3))

    geometry.computeBoundingBox()

    return geometry
}

const getVertical = (points: Point[], top: number, bottom: number, flip?: boolean): number[] => {
    const vertical = []
    for (let i = 0; i < points.length; i++) {
        const start = points[i]
        const end = points[(i + 1) % points.length]
        let triangle1 = [start.x, bottom, start.z, end.x, bottom, end.z, start.x, top, start.z]
        let triangle2 = [start.x, top, start.z, end.x, bottom, end.z, end.x, top, end.z]
        if (flip) {
            triangle1 = [start.x, bottom, start.z, start.x, top, start.z, end.x, bottom, end.z]
            triangle2 = [start.x, top, start.z, end.x, top, end.z, end.x, bottom, end.z]
        }
        vertical.push(...triangle1, ...triangle2)
    }
    return vertical
}

const getHorizontal = (points: Point[], elevation: number, flip?: boolean): number[] => {
    const horizontal = []
    for (let i = 0; i < points.length - 2; i++) {
        const pointA = points[0]
        const pointB = points[i + 1]
        const pointC = points[i + 2]
        let triangle = [pointA.x, elevation, pointA.z, pointB.x, elevation, pointB.z, pointC.x, elevation, pointC.z]
        if (flip) {
            triangle = [pointA.x, elevation, pointA.z, pointC.x, elevation, pointC.z, pointB.x, elevation, pointB.z]
        }
        horizontal.push(...triangle)
    }
    return horizontal
}

const buildNormals = (positions: number[]): number[] => {
    let normals = []
    const pA = new Vector3()
    const pB = new Vector3()
    const pC = new Vector3()
    const ba = new Vector3()
    const ca = new Vector3()
    let nx, ny, nz: number
    let i = -1
    while (i < positions.length - 1) {
        pA.set(positions[++i], positions[++i], positions[++i])
        pB.set(positions[++i], positions[++i], positions[++i])
        pC.set(positions[++i], positions[++i], positions[++i])
        ba.subVectors(pB, pA)
        ca.subVectors(pC, pA)
        ba.cross(ca).normalize()
        nx = ba.x
        ny = ba.y
        nz = ba.z
        normals.push(nx, ny, nz)
        normals.push(nx, ny, nz)
        normals.push(nx, ny, nz)
    }
    return normals
}