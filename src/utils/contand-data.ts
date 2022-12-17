import {ContentData, Tour} from '../contracts/content-data';

export const retrieveActiveRoomName = ({ tour: { activeRoom = '', rooms = {} } = {} as Tour }: ContentData): string => {
    const roomItems = Object.entries(rooms).map(([key, value]) => ({
        key,
        ...value
    }))
    return roomItems.find(({ key }) => key === activeRoom)?.name || ''
}
