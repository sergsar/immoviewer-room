import React, {useEffect, useMemo, useRef, useState} from 'react'
import {buildRooms} from '../utils/builder'
import {animateScene, initThreeScene} from '../utils/scene'
import {IThreeSetup} from '../models/three-setup'
import {SceneData} from '../models/scene-data'

type SceneProps = {
    data: SceneData,
    className: string
}

const play = (
    setup: IThreeSetup
) => {
    requestAnimationFrame( () => play(setup))
    animateScene(setup)
}

export const Scene: React.FC<SceneProps> = ({ data, className }) => {
    const [scene, setScene] = useState<IThreeSetup|undefined>()

    const canvasRef = useRef(null)

    const { threeDeeData, contentData, activeRoom } = data

    const rooms = useMemo(() => {
        if (!(threeDeeData && contentData)) {
            return []
        }
        return buildRooms(threeDeeData, contentData)
    }, [threeDeeData, contentData])

    const { current: canvas } = canvasRef

    useEffect(
        () => {
            if (scene) {
                return
            }
            if (!(canvas && rooms.length && activeRoom)) {
                return
            }
            const threeScene = initThreeScene(canvas, rooms, activeRoom)
            setScene(threeScene)
            play(threeScene)
        },
        [canvas, rooms, activeRoom, scene]
    )

    useEffect(() => scene?.changeRoom(activeRoom), [activeRoom])

    return (
        <div className={className}>
            <canvas style={{ width: '100%', height: '100%', display: 'block' }} ref={canvasRef}/>
        </div>
    )
}