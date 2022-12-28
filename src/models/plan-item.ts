import { IPoint2D } from './point'

export interface IPlanItemCamera extends IPlanItem {
  name: string
}

export interface IPlanItemRoom extends IPlanItem {
  name: string
}

export interface IPlanItem {
  alias: PLAN_ITEM_ALIAS
  points: IPoint2D[]
}

export type PLAN_ITEM_ALIAS = 'room' | 'camera'
