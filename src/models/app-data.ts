import {ThreeDeeData} from '../contracts/three-dee-data';
import {ContentData} from '../contracts/content-data';

export interface AppData {
    threeDeeData: ThreeDeeData
    contentData: ContentData
    activeRoom: string
}
