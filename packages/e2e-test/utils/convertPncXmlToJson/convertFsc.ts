export type Fsc = {
  forceStationCode: string
}

const convertFsc = (fscValue: string): Fsc => {
  return {
    forceStationCode: fscValue.substring(1, 5).trim()
  }
}

export default convertFsc
