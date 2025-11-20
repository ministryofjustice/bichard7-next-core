export type Rcc = {
  updateType: string
  ptiUrn: string
}

const convertRcc = (rccValue: string) => ({
  updateType: rccValue.substring(0, 1).trim(),
  ptiUrn: rccValue.substring(1, 20).trim()
})

export default convertRcc
