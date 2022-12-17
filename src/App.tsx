import React, {useEffect, useMemo, useState} from 'react'
import './App.css'
import { useData } from './hooks/use-data'
import {ThreeDeeData} from './contracts/three-dee-data'
import {ContentData} from './contracts/content-data';
import {Scene} from './components/Scene';
import {RoomsList} from './components/RoomsList';
import {retrieveActiveRoomName} from './utils/contand-data';
import {SceneData} from './models/scene-data';

function App() {
    const { data: contentData} = useData<ContentData>({ name: '1' })
    console.log('contentData: ', contentData)

    const { data: threeDeeData} = useData<ThreeDeeData>({ name: '2' })
    console.log('threeDeeData: ', threeDeeData)

    const [roomName, setRoomName] = useState('')

    const data: SceneData = useMemo(
        () => ({ threeDeeData, contentData, activeRoom: roomName }),
        [threeDeeData, contentData, roomName]
    )

    useEffect(
        () => setRoomName(
            retrieveActiveRoomName(contentData)
        ),
        [contentData]
    )

    return (
        <div className="App">
          <RoomsList
              data={contentData}
              roomClick={setRoomName}
              selected={roomName}
              className="room-list"
          />
          <Scene data={data} className="scene" />
        </div>
    )
}

export default App
