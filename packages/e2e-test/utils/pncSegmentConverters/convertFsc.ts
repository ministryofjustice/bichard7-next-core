export const convertFsc = (fscXml: string) => {
  return {
    updateTypeKey: fscXml.substring(0, 1),
    forceStationCode: fscXml.substring(1, 5)
  }
}
