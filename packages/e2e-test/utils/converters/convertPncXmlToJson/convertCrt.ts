export type Crt = {
  courtCode: string
  courtName: string
  courtDate: string
}

const convertCrt = (crtValue: string): Crt => {
  const slice = (start: number, end: number) => crtValue.substring(start, end).trim()

  return {
    courtCode: slice(1, 5),
    courtName: slice(5, 76),
    courtDate: slice(76, 84)
  }
}

export default convertCrt
