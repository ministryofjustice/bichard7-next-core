export const convertAch = (achXml: string) => {
  const slice = (start: number, end: number) => achXml.substring(start, end).trim()

  return {
    updateTypeInfo: slice(0, 1),
    crimeOffenceReferenceNumber: slice(1, 16),
    arrestOffenceNumber: slice(16, 19),
    offenceQualifier: slice(19, 23),
    apcoOffenceCode: slice(23, 33),
    offenceDescription: slice(33, 141),
    cjsOffenceCode: slice(141, 149),
    methodUsed: slice(149, 917),
    dress: slice(917, 1017),
    committedOnBail: slice(1017, 1018),
    locationOfOffence: slice(1018, 1249),
    offenceLocationFSCode: slice(1249, 1253),
    offenceStartDate: slice(1253, 1261),
    offenceStartTime: slice(1261, 1265),
    offenceEndDate: slice(1265, 1273),
    offenceEndTime: slice(1273, 1277)
  }
}
