export class Loader {
  private increment: number = 0
  private loadings: number[] = []

  constructor(private onLoad?: (loading: boolean) => void) {}

  public isLoading(): boolean {
    return !!this.loadings?.length
  }

  public load<T>(callback: () => T): [T, number] {
    this.onLoad?.(true)
    return [callback(), this.increment++]
  }

  public complete(id: number): void {
    this.loadings = this.loadings.filter((item) => item !== id)
    this.onLoad?.(!!this.loadings.length)
  }
}
