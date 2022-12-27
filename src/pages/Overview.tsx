import './Overview.scss'

import React, { useEffect, useState } from 'react'

import { Plan } from '../components/Plan/Plan'
import { RoomsList } from '../components/RoomList/RoomsList'
import { Scene } from '../components/Scene/Scene'
import { TOP_VIEW } from '../consts/names'
import { useApData } from '../hooks/use-ap-data'

export const Overview: React.FC = () => {
  const [roomName, setRoomName] = useState('')

  const { data } = useApData()

  useEffect(() => {
    if (roomName) {
      return
    }
    data?.activeRoom && setRoomName(data.activeRoom)
  }, [data])

  return (
    <div className="room-demo-overview">
      {data && (
        <>
          <div className="view">
            <div className="buttons">
              <RoomsList
                data={data.contentData}
                roomClick={setRoomName}
                selected={roomName}
              />
              <a
                href="https://github.com/sergsar/immoviewer-room"
                target="_blank"
                rel="noreferrer"
              >
                https://github.com/sergsar/immoviewer-room
              </a>
            </div>
            {roomName !== TOP_VIEW && (
              <Plan data={data} selected={roomName} className="plan" />
            )}
          </div>
          <Scene data={data} selected={roomName} className="scene" />
        </>
      )}
    </div>
  )
}
