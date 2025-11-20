export type Fsc = {
  updateType: string
  forceStationCode: string
}

const convertFsc = (fscValue: string): Fsc => {
  return {
    updateType: fscValue.substring(0, 1).trim(),
    forceStationCode: fscValue.substring(1, 5).trim()
  }
}

export default convertFsc
