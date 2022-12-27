import './Plan.scss'

import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'

import { PlanSetup } from '../../classes/plan-setup'
import { AppData } from '../../models/app-data'

type PlanProps = {
  className: string
  selected: string
  data: AppData
}

export const Plan: React.FC<PlanProps> = ({ className, data, selected }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [plan, setPlan] = useState<PlanSetup | undefined>()

  const { current: canvas } = canvasRef

  useEffect(() => {
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('Failed to get the canvas context 2d')
      return
    }
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const planSetup = new PlanSetup(ctx)
    planSetup.setFlat(data.objectsData)
    planSetup.setHighlighted(selected)
    planSetup.redraw()
    setPlan(planSetup)
  }, [canvas])

  useEffect(() => {
    if (!plan) {
      return
    }
    plan.setHighlighted(selected)
    plan.redraw()
  }, [selected])

  return (
    <div className={clsx('room-demo-plan', className)}>
      <canvas ref={canvasRef} />
    </div>
  )
}
