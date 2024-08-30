export function logUiDetails(environment: string | null, build: string | null): void {
  console.clear()
  console.table({
    environment: environment ?? "local",
    build: build ?? "local"
  })
}
