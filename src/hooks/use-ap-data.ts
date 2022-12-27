import { useEffect, useState } from 'react'

import { ContentData } from '../contracts/content-data'
import { ObjectsData } from '../contracts/objects-data'
import { AppData } from '../models/app-data'
import { retrieveActiveRoomName } from '../utils/content-data'
import { useLocalData } from './use-local-data'

export const useApData = (): {
  data: AppData | undefined
} => {
  const [data, setData] = useState<AppData | undefined>()
  const { data: contentData } = useLocalData<ContentData>({
    name: '1',
  })
  const { data: threeDeeData } = useLocalData<ObjectsData>({
    name: '2',
  })

  useEffect(() => {
    if (!(threeDeeData && contentData)) {
      return
    }
    setData({
      objectsData: threeDeeData,
      contentData,
      activeRoom: retrieveActiveRoomName(contentData),
    })
  }, [threeDeeData, contentData])

  return { data }
}
