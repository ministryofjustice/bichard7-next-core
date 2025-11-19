const convertAsr = (asrValue: string) => ({
  updateType: asrValue.substring(0, 1),
  arrestSummonsNumber: asrValue.substring(1, 24),
  crimeOffenceReferenceNo: asrValue.substring(24, 39)
})

export default convertAsr
