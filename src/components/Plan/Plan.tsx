import './Plan.scss'

import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'

import { AppData } from '../../models/app-data'
import { IPoint2D } from '../../models/point'
import { place } from '../../utils/draw-plan'

type PlanProps = {
  className: string
  data: AppData
}

export const Plan: React.FC<PlanProps> = ({ className, data }) => {
  const canvasRef = useRef(null)

  const { current: canvas } = canvasRef

  useEffect(() => {
    if (!canvas) {
      return
    }
    drawPlan(canvas, data)
  }, [canvas])

  return (
    <div className={clsx('room-demo-plan', className)}>
      <canvas ref={canvasRef} />
    </div>
  )
}

const drawPlan = (canvas: HTMLCanvasElement, data: AppData) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.error('failed to get context 2d')
    return
  }

  let coordinateSets: Array<IPoint2D[]> = data.threeDeeData.rooms.map(
    ({ corners }) => corners.map(({ x, y }) => ({ x, y })),
  )

  const width = canvas.offsetWidth
  const height = canvas.offsetHeight

  coordinateSets = place(coordinateSets, width, height, 0.8)

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  ctx.lineWidth = 2

  coordinateSets.forEach((coordinates) => {
    const path = new Path2D()
    path.moveTo(coordinates[0].x, coordinates[0].y)
    coordinates.forEach((coordinate) => {
      path.lineTo(coordinate.x, coordinate.y)
    })
    path.closePath()
    ctx.strokeStyle = 'white'
    ctx.stroke(path)
  })
}
