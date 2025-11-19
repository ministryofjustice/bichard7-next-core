const convertRcc = (rccValue: string) => ({
  updateType: rccValue.substring(0, 1),
  ptiUrn: rccValue.substring(1, 20)
})

export default convertRcc
