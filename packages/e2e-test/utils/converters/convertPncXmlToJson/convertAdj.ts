export type Adj = {
  plea: string
  adjudication: string
  dateOfSentence: string
  offenceTICNumber: string
  weedFlag: string
}

const convertAdj = (adjValue: string): Adj => {
  const slice = (start: number, end: number) => adjValue.substring(start, end).trim()

  return {
    plea: slice(1, 14),
    adjudication: slice(14, 28),
    dateOfSentence: slice(28, 36),
    offenceTICNumber: slice(36, 40),
    weedFlag: slice(40, 41)
  }
}

export default convertAdj
