import type { AmendmentKeys, Amendments } from "@moj-bichard7/common/types/Amendments"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import amendAsn from "./utils/amendAsn"
import amendCourtCaseReference from "./utils/amendCourtCaseReference"
import amendCourtOffenceSequenceNumber from "./utils/amendCourtOffenceSequenceNumber"
import amendCourtReference from "./utils/amendCourtReference"
import amendForceOwner from "./utils/amendForceOwner"
import amendNextHearingDate from "./utils/amendNextHearingDate"
import amendNextResultSourceOrganisation from "./utils/amendNextResultSourceOrganisation"
import amendOffenceCourtCaseReferenceNumber from "./utils/amendOffenceCourtCaseReferenceNumber"
import amendOffenceReasonSequence from "./utils/amendOffenceReasonSequence"
import amendResultQualifierCode from "./utils/amendResultQualifierCode"
import amendResultVariableText from "./utils/amendResultVariableText"
import removeEmptyResultQualifierVariable from "./utils/removeEmptyResultQualifierVariable"

const selectKey =
  (aho: AnnotatedHearingOutcome) =>
  <T extends AmendmentKeys>(key: T, value: Amendments[T]) => {
    switch (key) {
      case "asn":
        amendAsn(value as Amendments["asn"], aho)
        break
      case "courtCaseReference":
        amendCourtCaseReference(value as Amendments["courtCaseReference"], aho)
        break
      case "courtOffenceSequenceNumber":
        amendCourtOffenceSequenceNumber(value as Amendments["courtOffenceSequenceNumber"], aho)
        break
      case "courtPNCIdentifier":
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.CourtPNCIdentifier =
          value as Amendments["courtPNCIdentifier"]
        break
      case "courtReference":
        amendCourtReference(value as Amendments["courtReference"], aho)
        break
      case "forceOwner":
        amendForceOwner(value as string, aho)
        break
      case "nextHearingDate":
        amendNextHearingDate(value as Amendments["nextHearingDate"], aho)
        break
      case "nextSourceOrganisation":
        amendNextResultSourceOrganisation(value as Amendments["nextSourceOrganisation"], aho)
        break
      case "offenceCourtCaseReferenceNumber":
        amendOffenceCourtCaseReferenceNumber(value as Amendments["offenceCourtCaseReferenceNumber"], aho)
        break
      case "offenceReasonSequence":
        amendOffenceReasonSequence(value as Amendments["offenceReasonSequence"], aho)
        break
      case "resultQualifierCode":
        amendResultQualifierCode(value as Amendments["resultQualifierCode"], aho)
        removeEmptyResultQualifierVariable(aho)
        break
      case "resultVariableText":
        amendResultVariableText(value as Amendments["resultVariableText"], aho)
        break
      default:
        return
    }
  }

const applyAmendmentsToAho = <T extends AnnotatedHearingOutcome | PncUpdateDataset>(
  amendments: Amendments,
  aho: T
): Error | T => {
  const selectKeyWithAho = selectKey(aho)
  for (const [key, value] of Object.entries(amendments)) {
    try {
      selectKeyWithAho(key as AmendmentKeys, value)
    } catch (err) {
      return err as Error
    }
  }

  return aho
}

export default applyAmendmentsToAho
