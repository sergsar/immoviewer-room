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
            <header className="header">
                <RoomsList
                    data={contentData}
                    roomClick={setRoomName}
                    selected={roomName}
                />
                <a
                    href="https://github.com/sergsar/immoviewer-room"
                    target="_blank"
                >
                    https://github.com/sergsar/immoviewer-room
                </a>
            </header>
            <Scene data={data} className="scene" />
        </div>
    )
}

export default App
