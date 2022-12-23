import './Overview.scss'

import React, { useEffect, useState } from 'react'

import { RoomsList } from '../components/RoomsList'
import { Scene } from '../components/Scene'
import { useApData } from '../hooks/use-ap-data'

export const Overview: React.FC = () => {
  const [roomName, setRoomName] = useState('')

  const { data } = useApData()

  useEffect(() => {
    data?.activeRoom && setRoomName(data.activeRoom)
  }, [data])

  return (
    <div className='room-demo-overview'>
      {data && (
        <>
          <div className='buttons'>
            <RoomsList data={data.contentData} roomClick={setRoomName} selected={roomName} />
            <a href='https://github.com/sergsar/immoviewer-room' target='_blank' rel='noreferrer'>
              https://github.com/sergsar/immoviewer-room
            </a>
          </div>
          <Scene data={data} selected={roomName} className='scene' />
        </>
      )}
    </div>
  )
}
