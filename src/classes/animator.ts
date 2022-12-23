export class Animator {
  public callback?: () => void

  private object: unknown

  public start() {
    this.stop()
    this.play((this.object = {}))
  }

  public stop() {
    this.object = undefined
  }

  private play(object: unknown) {
    if (this.object !== object) {
      return
    }
    requestAnimationFrame(() => this.play(object))
    this.callback && this.callback()
  }
}
