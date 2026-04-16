import type { AdditionalArrestOffences, Defendant, Offence } from "@moj-bichard7/core/types/leds/DisposalRequest"

const dropUndefinedFields = (obj: Record<string, unknown>) => JSON.parse(JSON.stringify(obj))

const normaliseDefendant = (defendant: Defendant): void => {
  if (defendant.defendantType === "individual") {
    defendant.defendantFirstNames = defendant.defendantFirstNames?.map((firstName) => firstName.toLowerCase())
    defendant.defendantLastName = defendant.defendantLastName.toLowerCase()
  }
}

const normaliseOffences = (offences: Offence[]): void => {
  offences.forEach((offence) => {
    offence.offenceId = "__STRIPPED_ID__"

    if (Array.isArray(offence.disposalResults)) {
      offence.disposalResults.forEach((dr) => (dr.disposalText = dr.disposalText?.toLowerCase()))
    }
  })
}

const normaliseAdditionalArrestOffences = (additionalArrestOffences: AdditionalArrestOffences[]): void => {
  additionalArrestOffences.forEach((additionalArrestOffence) => {
    additionalArrestOffence.additionalOffences.forEach((offence) => {
      if (offence.locationText) {
        offence.locationText.locationText = offence.locationText.locationText?.toLowerCase() ?? ""
      }
    })
  })
}

const normaliseForComparison = (data: Record<string, unknown> | undefined): Record<string, unknown> | undefined => {
  if (!data) {
    return undefined
  }

  const result = structuredClone(data)

  if (Array.isArray(result.bailConditions)) {
    result.bailConditions = result.bailConditions.map((c) => c.toUpperCase())
  }

  if ("defendant" in result) {
    normaliseDefendant(result.defendant as Defendant)
  }

  if (Array.isArray(result.offences)) {
    normaliseOffences(result.offences as Offence[])
  }

  if (Array.isArray(result.additionalArrestOffences)) {
    normaliseAdditionalArrestOffences(result.additionalArrestOffences as AdditionalArrestOffences[])
  }

  // TODO: To be removed once ptiurn mapping is fixed
  result.personUrn = "__STRIPPED_PERSON_URN__"

  return dropUndefinedFields(result)
}

export default normaliseForComparison
