import type { AdditionalArrestOffences, Defendant } from "@moj-bichard7/core/types/leds/DisposalRequest"

const dropUndefinedFields = (obj: Record<string, unknown>) => JSON.parse(JSON.stringify(obj))

export const mormaliseForComparison = (
  data: Record<string, unknown> | undefined
): Record<string, unknown> | undefined => {
  if (!data) {
    return undefined
  }

  const result = { ...data }

  result.checkName = "__STRIPPED_CHECK_NAME__"

  if (typeof result.checkName === "string") {
    result.checkName = result.checkName.toLowerCase()
  }

  if ("defendant" in result) {
    const defendant = result.defendant as Defendant

    if (defendant.defendantType === "individual") {
      defendant.defendantFirstNames = defendant.defendantFirstNames?.map((firstName) => firstName.toLowerCase())
      defendant.defendantLastName = defendant.defendantLastName.toLowerCase()
    }
  }

  if ("offences" in result && Array.isArray(result.offences)) {
    result.offences = result.offences.map((offence) => {
      offence.offenceId = "__STRIPPED_ID__"
      return offence
    })
  }

  if ("additionalArrestOffences" in result && Array.isArray(result.additionalArrestOffences)) {
    const additionalArrestOffences = result.additionalArrestOffences as AdditionalArrestOffences[]

    result.additionalArrestOffences = additionalArrestOffences.map((additionalArrestOffence) => {
      additionalArrestOffence.additionalOffences.map((offence) => offence.locationText?.toLowerCase())
    })
  }

  // TODO: To be removed once ptiurn mapping is fixed
  result.personUrn = "__STRIPPED_PERSON_URN__"

  return dropUndefinedFields(result)
}
