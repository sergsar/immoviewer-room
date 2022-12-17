import {Object3D, Vector3} from 'three';

export interface IRoom {
    object: Object3D
    name: string
    camera: ICamera
}

export interface ICamera {
    position: Vector3
}