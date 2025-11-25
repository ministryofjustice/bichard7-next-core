export type Ach = {
  crimeOffenceReferenceNumber: string
  arrestOffenceNumber: string
  offenceQualifier: string
  apcoOffenceCode: string
  offenceDescription: string
  cjsOffenceCode: string
  methodUsed: string
  dress: string
  committedOnBail: string
  locationOfOffence: string
  offenceLocationFSCode: string
  offenceStartDate: string
  offenceStartTime: string
  offenceEndDate: string
  offenceEndTime: string
}

const convertAch = (achValue: string): Ach => {
  let currentIndex = 0
  const read = (length: number) => {
    const value = achValue.substring(currentIndex, currentIndex + length)
    currentIndex += length

    return value.trim()
  }

  return {
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

export default convertAch
