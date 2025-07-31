export type OffenceVisibilityMap = {
  [key: number]: boolean
}

export const initialOffencesVisibility = (offencesCount: number): OffenceVisibilityMap => {
  const initialState: OffenceVisibilityMap = {}
  Array.from({ length: offencesCount }).forEach((_, i) => {
    initialState[i + 1] = true
  })
  return initialState
}
