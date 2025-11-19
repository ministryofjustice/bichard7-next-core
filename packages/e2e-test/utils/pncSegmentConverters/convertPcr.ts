const convertPcr = (pcrValue: string) => ({
  updateType: pcrValue.substring(0, 1),
  PenaltyCaseRefNo: pcrValue.substring(1, 20),
  ...(pcrValue.length > 20 && { crimeOffenceRefNo: pcrValue.substring(20, 35) })
})

export default convertPcr
