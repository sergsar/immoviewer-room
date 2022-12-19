import {AppData} from '../models/app-data';
import {useLocalData} from "./use-local-data";
import {ContentData} from "../contracts/content-data";
import {ThreeDeeData} from "../contracts/three-dee-data";
import {useEffect, useState} from "react";
import {retrieveActiveRoomName} from "../utils/contand-data";

export const useApData = (): { data: AppData|undefined } => {
    const [data, setData] = useState<AppData|undefined>()
    const { data: contentData} = useLocalData<ContentData>({ name: '1' })
    const { data: threeDeeData} = useLocalData<ThreeDeeData>({ name: '2' })

    useEffect(() => {
        if (!(threeDeeData && contentData)) {
            return
        }
        setData({
            threeDeeData,
            contentData,
            activeRoom: retrieveActiveRoomName(contentData)
        })
    }, [threeDeeData, contentData])

    return { data }
}