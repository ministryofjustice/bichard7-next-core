export const convertCrt = (crtValue: string) => {
  const slice = (start: number, end: number) => crtValue.substring(start, end).trim()

  return {
    updateTypeInfo: slice(0, 1),
    courtCode: slice(1, 5),
    courtName: slice(5, 76),
    courtDate: slice(76, 84)
  }
}
