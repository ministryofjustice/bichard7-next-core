import type { Defendant } from "@moj-bichard7/core/types/leds/DisposalRequest"
import type { ConvertPncToLedsResult, Operation } from "./converters/convertPncToLeds"

const sanitiseForComparison = (result: Record<string, unknown>): Record<string, unknown> => {
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
      offence.offenceId = ""
      return offence
    })
  }

  // TODO: To be removed once ptiurn mapping is fixed
  result.personUrn = ""

  return result
}

export const sanitiseLocalMockRequest = <T extends Operation>(
  obj: ConvertPncToLedsResult<T>
): ConvertPncToLedsResult<T> => {
  const dropUndefinedFields = JSON.parse(JSON.stringify({ ...obj }))

  return sanitiseForComparison(dropUndefinedFields) as ConvertPncToLedsResult<T>
}

export const sanitiseServerMockRequest = (
  obj: Record<string, unknown> | undefined
): Record<string, unknown> | undefined => {
  if (!obj) {
    return undefined
  }

  return sanitiseForComparison({ ...obj })
}
