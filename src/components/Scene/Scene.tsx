import './Scene.scss'

import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'

import { AnimationContext } from '../../classes/animation-context'
import { SceneSetup } from '../../classes/scene-setup'
import { AppData } from '../../models/app-data'
import { buildFlat } from '../../utils/builder'

type SceneProps = {
  data: AppData
  selected: string
  className: string
  animationContext: AnimationContext
  onLoadingState: (state: boolean) => void
}

export const Scene: React.FC<SceneProps> = ({
  data,
  selected,
  animationContext,
  className,
  onLoadingState
}) => {
  const [scene, setScene] = useState<SceneSetup | null>()

  const canvasRef = useRef(null)

  const { objectsData, contentData } = data

  const { current: canvas } = canvasRef

  useEffect(() => {
    if (scene) {
      return
    }
    if (!(canvas && selected)) {
      return
    }
    const threeScene = new SceneSetup(canvas, animationContext)
    const flat = buildFlat(objectsData, contentData, (loading: boolean) => {
      onLoadingState(loading)
      threeScene.play(!loading)
    })
    threeScene.setFlat(flat)
    threeScene.switchCamera(selected)
    setScene(threeScene)
  }, [canvas, selected, scene])

  useEffect(() => scene?.switchCamera(selected), [selected])

  useEffect(() => {
    console.warn('mount scene')
    // Here the component will mount
    return () => {
      console.warn('unmount scene')
      // Here the component will unmount
      scene?.dispose()
      setScene(null)
    }
  }, [])

  return (
    <div className={clsx('room-demo-scene', className)}>
      <canvas
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
        ref={canvasRef}
      />
    </div>
  )
}
