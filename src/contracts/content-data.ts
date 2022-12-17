
export interface ContentData {
    tour: Tour
}

export interface RoomContent {
    name: string
    url: string
}

export interface Tour {
    activeRoom: string
    rooms: TourRooms
}

export interface TourRooms {
    [key: string]: RoomContent
}
