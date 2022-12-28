import { IPoint2D } from '../models/point'

export class DirectionPath {
  public readonly path: Path2D
  public readonly start: IPoint2D
  public readonly end: IPoint2D

  constructor(
    { x: centerX, y: centerY }: IPoint2D,
    radius: number,
    angle: number
  ) {
    const path = new Path2D()
    let points: IPoint2D[] = [
      { x: radius * 0.5, y: 0 },
      { x: -radius * 0.5, y: 0 },
      { x: -radius * 4, y: radius * 15 },
      { x: radius * 4, y: radius * 15 }
    ]
    const cosine = Math.cos(angle)
    const sine = Math.sin(angle)
    points = points.map(({ x, y }) => {
      const x1 = x * cosine - y * sine
      const y1 = x * sine + y * cosine
      return { x: x1 + centerX, y: y1 + centerY }
    })
    const start = points[0]
    path.moveTo(start.x, start.y)
    points.forEach(({ x, y }) => {
      path.lineTo(x, y)
    })
    path.closePath()
    // path.arc(centerX, centerY, radius, 0, 360)

    this.start = {
      x: 0.5 * (points[0].x + points[1].x),
      y: 0.5 * (points[0].y + points[1].y)
    }
    this.end = {
      x: 0.5 * (points[2].x + points[3].x),
      y: 0.5 * (points[2].y + points[3].y)
    }
    this.path = path
  }
}
