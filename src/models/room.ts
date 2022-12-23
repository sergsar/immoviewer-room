import { Object3D, Vector3 } from 'three';

export interface IFlat {
    rooms: IRoom[]
    exterior: Object3D[]
}

export interface IRoom {
    object: Object3D
    name: string
    camera: ICamera
}

export interface ICamera {
    position: Vector3
}