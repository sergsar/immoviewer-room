export class Animator {
    public callback?: () => void

    private object: any

    public start() {
        this.stop()
        this.play(this.object = {})
    }

    public stop() {
        this.object = undefined
    }

    private play(object: any) {
        if (this.object !== object) {
            return
        }
        requestAnimationFrame(() => this.play(object))
        this.callback && this.callback()
    }
}
