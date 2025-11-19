const convertAdj = (adjValue: string) => ({
  intfcUpdateType: adjValue.substring(0, 1),
  plea: adjValue.substring(1, 14),
  adjudication1: adjValue.substring(14, 28),
  dateOfSentence: adjValue.substring(28, 36),
  offenceTICNumber: adjValue.substring(36, 40),
  weedFlag: adjValue.substring(40, 41)
})

export default convertAdj
