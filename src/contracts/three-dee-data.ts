export interface ThreeDeeData {
    rooms: Room[]
    cameras: Camera[]
}

export interface Camera {
    x: number,
    y: number,
    roomName: string,
    angle: number,
    mergeAngle: number
}

export interface Room {
    corners: Corner[],
    interiorCorners: InteriorCorner[]
    roomName: string
}

export interface Corner {
    x: number
    y: number
}

export interface InteriorCorner {
    x: number
    y: number
}
