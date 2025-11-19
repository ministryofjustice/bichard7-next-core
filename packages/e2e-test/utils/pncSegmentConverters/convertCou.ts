export const convertCou = (couXml: string) => {
  const slice = (start: number, end: number) => couXml.substring(start, end).trim()

  return {
    updateTypeInfo: slice(0, 1),
    courtCode: slice(1, 5),
    courtName: slice(5, 76),
    generatedPNCFilename: slice(76, 130),
    dateOfHearing: slice(130, 138),
    numberOfTics: slice(138, 142)
  }
}
