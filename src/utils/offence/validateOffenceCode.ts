import offenceCodeData from "data/offence-code.json"
import { OffenceCodeType } from "./consts"

export default (offenceCode: string, areaCode: string): OffenceCodeType => {
  const offenceCodeNoQualifier = offenceCode.match(/^[A-Z0-9]{1,7}/g)
  if (!offenceCodeNoQualifier) {
    return OffenceCodeType.INVALID_OFFENCE_CODE
  }
  // @ts-ignore ts thinks the json is {}
  const matches = offenceCodeData.filter((offence: { cjsCode: string }) =>
    offence.cjsCode.match(`^${offenceCodeNoQualifier}`)
  )

  if (matches.length) {
    return OffenceCodeType.NATIONAL_CODE
  }

  //@ts-ignore ts thinks the json is {}
  const localMatches = offenceCodeData.filter((offence) => offence.cjsCode.includes(`${areaCode}${offenceCode}`))

  if (localMatches.length) {
    return OffenceCodeType.LOCAL_CODE
  }

  return OffenceCodeType.NO_MATCHES
}
