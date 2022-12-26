import { IDimensions2D, IRect2D } from '../models/dimensions'
import { IPoint2D } from '../models/point'

export const getDimensions2D = (rect: IRect2D): IDimensions2D => {
  return {
    width: rect.max.x - rect.min.x,
    height: rect.max.y - rect.min.y,
  }
}

export const getFullRect2D = (coordinateSets: Array<IPoint2D[]>): IRect2D => {
  const rect: IRect2D = {
    min: { x: 0, y: 0 },
    max: { x: 0, y: 0 },
  }
  coordinateSets.forEach((set) =>
    set.forEach(({ x, y }) => {
      rect.min = {
        x: Math.min(rect.min.x, x),
        y: Math.min(rect.min.y, y),
      }
      rect.max = {
        x: Math.max(rect.max.x, x),
        y: Math.max(rect.max.y, y),
      }
    }),
  )
  return rect
}

export const place = (
  coordinateSets: Array<IPoint2D[]>,
  width: number,
  height: number,
  scale = 1,
): Array<IPoint2D[]> => {
  const rect = getFullRect2D(coordinateSets)
  const dimensions = getDimensions2D(rect)
  const rescale =
    Math.min(width / dimensions.width, height / dimensions.height) * scale
  const shiftX =
    -rect.min.x * rescale + (width - dimensions.width * rescale) * 0.5
  const shiftY =
    -rect.min.y * rescale + (height - dimensions.height * rescale) * 0.5

  return coordinateSets.map((set) =>
    set.map(({ x, y }) => ({
      x: x * rescale + shiftX,
      y: y * rescale + shiftY,
    })),
  )
}
