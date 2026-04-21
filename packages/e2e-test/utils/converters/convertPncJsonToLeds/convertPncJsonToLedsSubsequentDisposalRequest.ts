import { convertDate } from "@moj-bichard7/core/lib/policeGateway/leds/dateTimeConverter"
import type {
  ReasonForAppearance,
  SubsequentDisposalResultsRequest
} from "@moj-bichard7/core/types/leds/SubsequentDisposalResultsRequest"
import type { PncSubsequentDisposalJson } from "../convertPncXmlToJson/convertPncXmlToJson"
import { mapOffences } from "./convertPncJsonToLedsAddDisposalRequest"

const reasonForAppearance: Record<string, ReasonForAppearance> = {
  V: "Subsequently Varied",
  D: "Sentence Deferred"
}

export const convertPncJsonToLedsSubsequentDisposalRequest = (
  pncJson: PncSubsequentDisposalJson
): SubsequentDisposalResultsRequest => ({
  // TEMP: Remove before PR approval
  pncCheckName: pncJson.pncCheckName,
  croNumber: pncJson.croNumber,
  crimeOffenceReferenceNumber: "",
  // TEMP: Remove before PR approval
  ownerCode: pncJson.forceStationCode,
  personUrn: pncJson.pncIdentifier,
  courtCaseReference: pncJson.offences[0].courtCaseReference,
  court: {
    courtIdentityType: "code",
    courtCode: pncJson.courtCode ?? pncJson.subsequentUpdate.courtCode
  },
  appearanceDate: convertDate(pncJson.subsequentUpdate.hearingDate),
  reasonForAppearance: reasonForAppearance[pncJson.subsequentUpdate.hearingType],
  offences: mapOffences(pncJson.offences, false)
})
