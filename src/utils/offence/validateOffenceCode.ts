import { offenceCode as offenceCodes } from "@moj-bichard7-developers/bichard7-next-data"
import { OffenceCodeType } from "./consts"

export default (offenceCode: string, areaCode: string): OffenceCodeType => {
  const offenceCodeNoQualifier = offenceCode.match(/^[A-Z0-9]{1,7}/g)
  if (!offenceCodeNoQualifier) {
    return OffenceCodeType.INVALID_OFFENCE_CODE
  }

  const matches = offenceCodes.filter((offence: { cjsCode: string }) =>
    offence.cjsCode.match(`^${offenceCodeNoQualifier}`)
  )

  if (matches.length) {
    return OffenceCodeType.NATIONAL_CODE
  }

  const localMatches = offenceCodes.filter((offence) => offence.cjsCode.includes(`${areaCode}${offenceCode}`))

  if (localMatches.length) {
    return OffenceCodeType.LOCAL_CODE
  }

  return OffenceCodeType.NO_MATCHES
}
