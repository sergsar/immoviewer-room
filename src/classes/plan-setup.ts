import { ObjectsData } from '../contracts/objects-data'
import { IPlanItem } from '../models/plan-item'
import { place } from '../utils/draw-plan'

export class PlanSetup {
  private planItems: IPlanItem[] = []
  private highlighted = ''
  private readonly highlightedColor = 'rgba(255, 255, 255, 0.5)'
  private readonly strokeColor = 'rgba(255, 255, 255, 1)'

  constructor(private readonly context: CanvasRenderingContext2D) {}

  public setFlat(objectsData: ObjectsData) {
    const { context } = this

    const width = context.canvas.width
    const height = context.canvas.height

    const planItems: Array<IPlanItem> = objectsData.rooms.map(
      ({ corners, roomName }) => ({
        name: roomName,
        points: corners.map(({ x, y }) => ({ x: -x, y: -y })),
      }),
    )

    this.planItems = place(planItems, width, height, 0.8)
  }

  public setHighlighted(value: string) {
    this.highlighted = value
  }

  public redraw() {
    const { context, planItems, highlighted, highlightedColor, strokeColor } =
      this

    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.lineWidth = 2

    planItems.forEach(({ points, name }) => {
      const path = new Path2D()
      path.moveTo(points[0].x, points[0].y)
      points.forEach((coordinate) => {
        path.lineTo(coordinate.x, coordinate.y)
      })
      path.closePath()
      context.strokeStyle = strokeColor
      if (name === highlighted) {
        context.fillStyle = highlightedColor
        context.fill(path)
      }

      context.stroke(path)
    })
  }
}
