export interface ThreeDeeData {
    rooms: Room[]
}

export interface Room {
    corners: Corner[]
}

export interface Corner {
    x: number
    y: number
}
