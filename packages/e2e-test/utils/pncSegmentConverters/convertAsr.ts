export type Asr = {
  updateType: string
  arrestSummonsNumber: string
  crimeOffenceReferenceNo: string
}

const convertAsr = (asrValue: string): Asr => {
  const slice = (start: number, end: number) => asrValue.substring(start, end).trim()

  return {
    updateType: slice(0, 1),
    arrestSummonsNumber: slice(1, 24),
    crimeOffenceReferenceNo: slice(24, 39)
  }
}

export default convertAsr
