export const convertFsc = (fscValue: string) => {
  return {
    updateType: fscValue.substring(0, 1),
    forceStationCode: fscValue.substring(1, 5)
  }
}
