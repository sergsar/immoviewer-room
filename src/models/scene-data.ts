import {ThreeDeeData} from '../contracts/three-dee-data';
import {ContentData} from '../contracts/content-data';

export interface SceneData {
    threeDeeData: ThreeDeeData
    contentData: ContentData
    activeRoom: string
}
