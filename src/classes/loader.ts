export class Loader {
  private increment: number = 0
  private loadings: number[] = []

  constructor(private onLoadChanges?: (loading: boolean) => void) {}

  public isLoading(): boolean {
    return !!this.loadings?.length
  }

  public load<T>(callback: () => T): [T, number] {
    this.loadings.push(++this.increment)
    this.onLoadChanges?.(true)
    return [callback(), this.increment]
  }

  public complete(id: number): void {
    this.loadings = this.loadings.filter((item) => item !== id)
    this.onLoadChanges?.(!!this.loadings.length)
  }
}
