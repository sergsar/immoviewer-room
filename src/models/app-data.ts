import { ContentData } from '../contracts/content-data'
import { ObjectsData } from '../contracts/objects-data'

export interface AppData {
  objectsData: ObjectsData
  contentData: ContentData
  activeRoom: string
}
