const convertCch = (cchValue: string) => ({
  updateType: cchValue.substring(0, 1),
  offenceSequenceNumber: cchValue.substring(1, 4),
  cjsOffenceCode: cchValue.substring(18, 26)
})

export default convertCch
