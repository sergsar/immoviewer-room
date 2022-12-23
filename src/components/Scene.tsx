import React, { useEffect, useRef, useState } from 'react'

import { SceneSetup } from '../classes/scene-setup';
import { AppData } from '../models/app-data'
import { buildFlat } from '../utils/builder'

type SceneProps = {
    data: AppData,
    selected: string,
    className: string
}

export const Scene: React.FC<SceneProps> = ({ data, selected, className }) => {
    const [scene, setScene] = useState<SceneSetup|undefined>()

    const canvasRef = useRef(null)

    const { threeDeeData, contentData } = data

    const { current: canvas } = canvasRef

    useEffect(
        () => {
            if (scene) {
                return
            }
            if (!(canvas && selected)) {
                return
            }
            const threeScene = new SceneSetup(canvas)
            const flat = buildFlat(threeDeeData, contentData)
            threeScene.setFlat(flat)
            threeScene.switchCamera(selected)
            setScene(threeScene)
        },
        [canvas, selected, scene]
    )

    useEffect(() => scene?.switchCamera(selected), [selected])

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