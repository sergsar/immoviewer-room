import {Camera, Scene, WebGLRenderer} from 'three';

export interface IThreeSetup {
    renderer: WebGLRenderer
    scene: Scene
    camera: Camera
    changeRoom: (name: string) => void
}
