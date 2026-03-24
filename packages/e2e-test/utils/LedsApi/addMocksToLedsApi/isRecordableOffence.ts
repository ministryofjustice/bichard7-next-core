import { lookupOffenceByCjsCode } from "@moj-bichard7/common/aho/dataLookup/index"
import { ignoredOffenceCategories } from "@moj-bichard7/core/lib/offences/isRecordableOffence"

const isRecordableOffence = (offenceCode: string) => {
  const offence = lookupOffenceByCjsCode(offenceCode)

  return offence?.offenceCategory && !ignoredOffenceCategories.includes(offence.offenceCategory)
}

export default isRecordableOffence
