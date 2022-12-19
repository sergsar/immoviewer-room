import React, {useEffect, useState} from 'react'
import './App.css'
import {Scene} from './components/Scene';
import {RoomsList} from './components/RoomsList';
import {useApData} from "./hooks/use-ap-data";

function App() {
    const [roomName, setRoomName] = useState('')

    const { data } = useApData()

    useEffect(
        () => {
            data?.activeRoom && setRoomName(data.activeRoom)
        },
        [data]
    )

    return (
        <div className="App">
            { data && (
                <>
                    <header className="header">
                        <RoomsList
                            data={data.contentData}
                            roomClick={setRoomName}
                            selected={roomName}
                        />
                        <a
                            href="https://github.com/sergsar/immoviewer-room"
                            target="_blank" rel="noreferrer"
                        >
                            https://github.com/sergsar/immoviewer-room
                        </a>
                    </header>
                    <Scene data={data} selected={roomName} className="scene" />
                </>
            )}
        </div>
    )
}

export default App
