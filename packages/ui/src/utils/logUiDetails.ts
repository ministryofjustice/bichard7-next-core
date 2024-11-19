export function logUiDetails(environment: null | string, build: null | string): void {
  console.clear()
  console.table({
    build: build ?? "local",
    environment: environment ?? "local"
  })
}
