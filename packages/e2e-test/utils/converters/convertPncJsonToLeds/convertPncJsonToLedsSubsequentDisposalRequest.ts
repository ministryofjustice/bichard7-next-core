import { convertDate } from "@moj-bichard7/core/lib/policeGateway/leds/dateTimeConverter"
import type {
  ReasonForAppearance,
  SubsequentDisposalResultsRequest
} from "@moj-bichard7/core/types/leds/SubsequentDisposalResultsRequest"
import type { PncSubsequentDisposalJson } from "../convertPncXmlToJson/convertPncXmlToJson"
import { mapOffences } from "./convertPncJsonToLedsAddDisposalRequest"

const reasonForAppearance: Record<string, ReasonForAppearance> = {
  V: "Subsequently Varied",
  D: "Sentenced Deferred"
}

export const convertPncJsonToLedsSubsequentDisposalRequest = (
  pncJson: PncSubsequentDisposalJson
): SubsequentDisposalResultsRequest => {
  return {
    ownerCode: pncJson.forceStationCode,
    personUrn: pncJson.pncIdentifier,
    checkName: pncJson.pncCheckName,
    courtCaseReference: pncJson.offences[0].courtCaseReference,
    court: {
      courtIdentityType: "code",
      courtCode: pncJson.courtCode ?? pncJson.subsequentUpdate.courtCode
    },
    appearanceDate: convertDate(pncJson.dateOfHearing),
    reasonForAppearance: reasonForAppearance[pncJson.subsequentUpdate.hearingType],
    offences: mapOffences(pncJson.offences)
  }
}
