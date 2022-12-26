import { IPoint2D } from './point'

export interface IRect2D {
  max: IPoint2D
  min: IPoint2D
}

export interface IDimensions2D {
  width: number
  height: number
}
