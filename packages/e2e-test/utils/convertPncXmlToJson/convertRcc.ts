export type Rcc = {
  ptiUrn: string
}

const convertRcc = (rccValue: string) => ({
  ptiUrn: rccValue.substring(1, 20).trim()
})

export default convertRcc
