import { ContentData } from '../contracts/content-data'
import { ObjectsData } from '../contracts/objects-data'

export interface AppData {
  threeDeeData: ObjectsData
  contentData: ContentData
  activeRoom: string
}
