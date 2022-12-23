import { ContentData } from '../contracts/content-data'
import { ThreeDeeData } from '../contracts/three-dee-data'

export interface AppData {
  threeDeeData: ThreeDeeData
  contentData: ContentData
  activeRoom: string
}
