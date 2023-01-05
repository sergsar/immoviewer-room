import { ObjectsData } from '../contracts/objects-data'
import { IPlanItem, IPlanItemCamera, IPlanItemRoom } from '../models/plan-item'
import { IPoint2D } from '../models/point'
import { place } from '../utils/draw-plan'
import { AnimationContext } from './animation-context'
import { Animator } from './animator'
import { DirectionPath } from './direction-path'

export class PlanSetup {
  private planItems: IPlanItem[] = []
  private highlighted = ''
  private roomOver = ''
  private readonly highlightedColor = 'rgba(255, 255, 255, 0.3)'
  private readonly strokeColor = 'rgba(255, 255, 255, 1)'

  private readonly animator: Animator = new Animator()

  private readonly clickBind: (e: MouseEvent) => void

  private pointer: IPoint2D = { x: 0, y: 0 }

  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly animationContext: AnimationContext,
    private readonly clickCallback: (name: string) => void
  ) {
    this.animator.callback = this.redraw.bind(this)
    this.animator.start()

    this.clickBind = this.click.bind(this)
    this.context.canvas.addEventListener('click', this.clickBind)
  }

  public dispose() {
    this.animator.stop()
    this.context.canvas.removeEventListener('click', this.clickBind)
  }

  public setFlat(objectsData: ObjectsData) {
    const { context } = this

    const width = context.canvas.width
    const height = context.canvas.height

    const planItems: Array<IPlanItem> = [
      ...objectsData.rooms.map(
        ({ corners, roomName }) =>
          ({
            alias: 'room',
            name: roomName,
            points: corners.map(({ x, y }) => ({ x: -x, y: -y }))
          } as IPlanItemRoom)
      ),
      ...objectsData.cameras.map(
        ({ x, y, roomName }) =>
          ({
            alias: 'camera',
            name: roomName,
            points: [{ x: -x, y: -y }]
          } as IPlanItemCamera)
      )
    ]

    this.planItems = place(planItems, width, height, 0.8)
  }

  public setHighlighted(value: string) {
    this.highlighted = value
  }

  private drawPlanItem(item: IPlanItem) {
    const { context, strokeColor, highlightedColor, highlighted, pointer } =
      this
    if (item.alias === 'room') {
      const { points, name } = item as IPlanItemRoom
      const path = new Path2D()
      path.moveTo(points[0].x, points[0].y)
      points.forEach((coordinate) => {
        path.lineTo(coordinate.x, coordinate.y)
      })
      path.closePath()
      context.globalCompositeOperation = 'source-over'
      context.strokeStyle = strokeColor
      if (name === highlighted) {
        context.fillStyle = highlightedColor
        context.fill(path)
      }

      context.stroke(path)
      if (context.isPointInPath(path, pointer.x, pointer.y)) {
        this.roomOver = name
      }
    }
    if (item.alias === 'camera') {
      const {
        points: [point],
        name
      } = item as IPlanItemRoom
      if (name === highlighted) {
        const directionPath = new DirectionPath(
          point,
          5,
          this.animationContext.cameraAngle
        )
        const { start, end } = directionPath
        const gradient = context.createLinearGradient(
          start.x,
          start.y,
          end.x,
          end.y
        )
        gradient.addColorStop(0, 'rgba(255, 255, 0, 1)')
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)')
        context.globalCompositeOperation = 'darken'
        context.strokeStyle = '#00000000'
        context.fillStyle = gradient
        context.fill(directionPath.path)
        context.stroke(directionPath.path)
      }
    }
  }

  private redraw() {
    const { context, planItems } = this

    this.roomOver = ''

    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.lineWidth = 2

    planItems.forEach((item) => {
      this.drawPlanItem(item)
    })
  }

  private click(e: MouseEvent) {
    const {
      context: { canvas }
    } = this
    const rect = canvas.getBoundingClientRect()
    this.pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    setTimeout(() => {
      if (!this.roomOver) {
        return
      }
      this.clickCallback(this.roomOver)
    }, 10)
  }
}
