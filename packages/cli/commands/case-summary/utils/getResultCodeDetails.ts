import { lookupResultCodeByCjsCode } from "@moj-bichard7/common/aho/dataLookup/dataLookup"

const getOffenceCodeDetails = (resultCode?: string | number): string => {
  if (!resultCode || String(resultCode) === "1000") {
    return "No result code"
  }

  const title = lookupResultCodeByCjsCode(resultCode.toString())?.description

  return title ? `${resultCode} (${title})` : String(resultCode)
}

export default getOffenceCodeDetails
