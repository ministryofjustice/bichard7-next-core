import type { AdditionalArrestOffences, Defendant, Offence } from "@moj-bichard7/core/types/leds/DisposalRequest"

const dropUndefinedFields = (obj: Record<string, unknown>) => JSON.parse(JSON.stringify(obj))

const normaliseForComparison = (data: Record<string, unknown> | undefined): Record<string, unknown> | undefined => {
  if (!data) {
    return undefined
  }

  const result = { ...data }

  if (result.bailConditions && Array.isArray(result.bailConditions)) {
    result.bailConditions = result.bailConditions.map((c) => c.toLowerCase().replace(/\s+/g, "")).join("")
  }

  if ("defendant" in result) {
    const defendant = result.defendant as Defendant

    if (defendant.defendantType === "individual") {
      defendant.defendantFirstNames = defendant.defendantFirstNames?.map((firstName) => firstName.toLowerCase())
      defendant.defendantLastName = defendant.defendantLastName.toLowerCase()
    }
  }

  if ("offences" in result && Array.isArray(result.offences)) {
    const offences = result.offences as Offence[]

    offences.map((offence) => {
      offence.offenceId = "__STRIPPED_ID__"

      if (Array.isArray(offence.disposalResults)) {
        offence.disposalResults.map((dr) => (dr.disposalText = dr.disposalText?.toLowerCase()))
      }

      return offence
    })
  }

  if ("additionalArrestOffences" in result && Array.isArray(result.additionalArrestOffences)) {
    const additionalArrestOffences = result.additionalArrestOffences as AdditionalArrestOffences[]

    additionalArrestOffences.map((additionalArrestOffence) => {
      return additionalArrestOffence.additionalOffences.map((offence) => {
        const offenceLocationText = offence.locationText

        if (offenceLocationText) {
          offenceLocationText.locationText = offence.locationText?.locationText
            ? offence.locationText?.locationText.toLowerCase()
            : ""
        }

        return offenceLocationText
      })
    })
  }

  // TODO: To be removed once ptiurn mapping is fixed
  result.personUrn = "__STRIPPED_PERSON_URN__"

  return dropUndefinedFields(result)
}

export default normaliseForComparison
