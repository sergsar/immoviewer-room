import './Overview.scss'

import React, { useEffect, useMemo, useState } from 'react'

import pkg from '../../package.json'
import { AnimationContext } from '../classes/animation-context'
import { Plan } from '../components/Plan/Plan'
import { RoomsList } from '../components/RoomList/RoomsList'
import { Scene } from '../components/Scene/Scene'
import { TOP_VIEW } from '../consts/names'
import { useApData } from '../hooks/use-ap-data'

export const Overview: React.FC = () => {
  const [roomName, setRoomName] = useState('')
  const [sceneLoading, setSceneLoading] = useState<boolean>(true)

  const { data } = useApData()

  const animationContext = useMemo(() => new AnimationContext(), [])

  useEffect(() => {
    if (roomName) {
      return
    }
    data?.activeRoom && setRoomName(data.activeRoom)
  }, [data])

  return (
    <div className="room-demo-overview">
      {(!data || sceneLoading) && <div className="preloader">...loading</div>}
      {data && (
        <>
          <div className="view">
            <div className="navigation">
              <RoomsList
                data={data.contentData}
                roomClick={setRoomName}
                selected={roomName}
                disabled={sceneLoading}
              />
              <div className="info-container">
                <a className="description">{pkg.description}</a>
                <a
                  className="url"
                  href={pkg.repository}
                  target="_blank"
                  rel="noreferrer"
                  title={pkg.repository}
                >
                  {pkg.repository}
                </a>
              </div>
            </div>
            {!(sceneLoading || roomName === TOP_VIEW) && (
              <Plan
                data={data}
                selected={roomName}
                animationContext={animationContext}
                roomClick={setRoomName}
                className="plan"
              />
            )}
          </div>
          <Scene
            data={data}
            selected={roomName}
            animationContext={animationContext}
            className="scene"
            onLoadingState={setSceneLoading}
          />
        </>
      )}
    </div>
  )
}
