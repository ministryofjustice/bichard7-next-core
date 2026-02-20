export type Cch = {
  offenceSequenceNumber: string
  cjsOffenceCode: string
}

const convertCch = (cchValue: string): Cch => {
  const slice = (start: number, end: number) => cchValue.substring(start, end).trim()

  return {
    offenceSequenceNumber: slice(1, 4),
    cjsOffenceCode: slice(18, 26)
  }
}

export default convertCch
