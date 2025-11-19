export const convertFsc = (fscXml: string) => {
  return {
    updateType: fscXml.substring(0, 1),
    forceStationCode: fscXml.substring(1, 5)
  }
}
