import './Plan.scss'

import clsx from 'clsx'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { AnimationContext } from '../../classes/animation-context'
import { PlanSetup } from '../../classes/plan-setup'
import { AppData } from '../../models/app-data'

type PlanProps = {
  className: string
  selected: string
  data: AppData
  animationContext: AnimationContext
  roomClick: (name: string) => void
}

export const Plan: React.FC<PlanProps> = ({
  className,
  data,
  selected,
  animationContext,
  roomClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [plan, setPlan] = useState<PlanSetup | null>()

  const { current: canvas } = useMemo(() => canvasRef, [canvasRef])

  useEffect(() => {
    if (!canvas) {
      setPlan(null)
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('Failed to get the canvas context 2d')
      return
    }
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const planSetup = new PlanSetup(ctx, animationContext, roomClick)
    planSetup.setFlat(data.objectsData)
    planSetup.setHighlighted(selected)
    setPlan(planSetup)
  }, [canvas])

  useEffect(() => {
    if (!plan) {
      return
    }
    plan.setHighlighted(selected)
  }, [selected])

  useEffect(() => {
    console.warn('mount plan')
    // Here the component will mount
    return () => {
      console.warn('unmount plan')
      // Here the component will unmount
      plan?.dispose()
      setPlan(null)
    }
  }, [])

  return (
    <div className={clsx('room-demo-plan', className)}>
      <canvas ref={canvasRef} />
    </div>
  )
}
