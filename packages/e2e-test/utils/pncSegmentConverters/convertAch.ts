export const convertAch = (achValue: string) => {
  let currentIndex = 0
  const read = (length: number) => {
    const value = achValue.substring(currentIndex, currentIndex + length)
    currentIndex += length

    return value.trim()
  }

  return {
    updateTypeInfo: read(1),
    crimeOffenceReferenceNumber: read(15),
    arrestOffenceNumber: read(3),
    offenceQualifier: read(4),
    apcoOffenceCode: read(10),
    offenceDescription: read(108),
    cjsOffenceCode: read(8),
    methodUsed: read(768),
    dress: read(100),
    committedOnBail: read(1),
    locationOfOffence: read(231),
    offenceLocationFSCode: read(4),
    offenceStartDate: read(8),
    offenceStartTime: read(4),
    offenceEndDate: read(8),
    offenceEndTime: read(4)
  }
}
