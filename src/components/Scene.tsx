import React, {useEffect, useMemo, useRef, useState} from 'react'
import {buildFlat} from '../utils/builder'
import {initThreeScene} from '../utils/scene'
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
    setup.animate()
}

export const Scene: React.FC<SceneProps> = ({ data, className }) => {
    const [scene, setScene] = useState<IThreeSetup|undefined>()

    const canvasRef = useRef(null)

    const { threeDeeData, contentData, activeRoom } = data

    const flat = useMemo(() => {
        if (!(threeDeeData && contentData)) {
            return null
        }
        return buildFlat(threeDeeData, contentData)
    }, [threeDeeData, contentData])

    const { current: canvas } = canvasRef

    useEffect(
        () => {
            if (scene) {
                return
            }
            if (!(canvas && flat?.rooms.length && flat?.exterior.length && activeRoom)) {
                return
            }
            const threeScene = initThreeScene(canvas, flat, activeRoom)
            setScene(threeScene)
            play(threeScene)
        },
        [canvas, flat, activeRoom, scene]
    )

    useEffect(() => scene?.changeRoom(activeRoom), [activeRoom])

    useEffect(() => {
        console.warn('mount scene')
        // Here the component will mount
        return () => {
            console.warn('unmount scene')
            // Here the component will unmount
            scene?.dispose()
            setScene(undefined)
        }
    }, [])

    return (
        <div className={className}>
            <canvas style={{ width: '100%', height: '100%', display: 'block' }} ref={canvasRef}/>
        </div>
    )
}