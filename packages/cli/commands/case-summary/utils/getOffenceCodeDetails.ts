type OffenceCode = {
  cjsCode: string
  description: string
  homeOfficeClassification: string
  notifiableToHo: boolean
  offenceCategory: string
  offenceTitle: string
  recordableOnPnc: boolean
}

let offenceCodes: OffenceCode[] = []

const getOffenceCodeDetails = async (offenceCode: string) => {
  if (offenceCodes.length === 0) {
    const offenceCodeResult = await fetch(
      "https://raw.githubusercontent.com/ministryofjustice/bichard7-next-data/refs/heads/main/output-data/data/offence-code.json"
    )
    offenceCodes = await offenceCodeResult.json()
  }

  const title = offenceCodes.find((offence) => offence.cjsCode === offenceCode)?.offenceTitle

  return title ? `${offenceCode} (${title})` : offenceCode
}

export default getOffenceCodeDetails
