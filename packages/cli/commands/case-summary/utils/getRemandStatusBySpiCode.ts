import { lookupRemandStatusBySpiCode } from "@moj-bichard7/common/aho/dataLookup/dataLookup"

const getRemandStatusBySpiCode = (spiStatus?: string): string => {
  if (!spiStatus) {
    return ""
  }

  const title = lookupRemandStatusBySpiCode(spiStatus)?.description

  return title ? `${title} (${spiStatus})` : spiStatus
}

export default getRemandStatusBySpiCode
