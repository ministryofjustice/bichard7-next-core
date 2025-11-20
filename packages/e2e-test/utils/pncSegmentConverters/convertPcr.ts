export type Pcr = {
  updateType: string
  PenaltyCaseRefNo: string
  crimeOffenceRefNo?: string
}

const convertPcr = (pcrValue: string): Pcr => {
  const slice = (start: number, end: number) => pcrValue.substring(start, end).trim()

  return {
    updateType: slice(0, 1),
    PenaltyCaseRefNo: slice(1, 20),
    ...(pcrValue.length > 20 && { crimeOffenceRefNo: slice(20, 35) })
  }
}

export default convertPcr
