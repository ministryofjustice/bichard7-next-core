import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/core/types/PncUpdateDataset"
import type { AmendmentKeys, Amendments } from "types/Amendments"
import amendAsn from "utils/amendments/amendAsn/amendAsn"
import amendCourtCaseReference from "utils/amendments/amendCourtCaseReference/amendCourtCaseReference"
import amendCourtOffenceSequenceNumber from "utils/amendments/amendCourtOffenceSequenceNumber"
import amendCourtReference from "utils/amendments/amendCourtReference/amendCourtReference"
import amendForceOwner from "utils/amendments/amendForceOwner"
import amendNextHearingDate from "utils/amendments/amendNextHearingDate"
import amendNextResultSourceOrganisation from "utils/amendments/amendNextResultSourceOrganisation"
import amendOffenceCourtCaseReferenceNumber from "utils/amendments/amendOffenceCourtCaseReferenceNumber"
import amendOffenceReasonSequence from "utils/amendments/amendOffenceReasonSequence"
import amendResultQualifierCode from "utils/amendments/amendResultQualifierCode"
import amendResultVariableText from "utils/amendments/amendResultVariableText"
import removeEmptyResultQualifierVariable from "utils/removeEmptyResultQualifierVariable"

const selectKey =
  (aho: AnnotatedHearingOutcome) =>
  <T extends AmendmentKeys>(key: T, value: Amendments[T]) => {
    switch (key) {
      case "asn":
        amendAsn(value as Amendments["asn"], aho)
        break
      case "offenceReasonSequence":
        amendOffenceReasonSequence(value as Amendments["offenceReasonSequence"], aho)
        break
      case "offenceCourtCaseReferenceNumber":
        amendOffenceCourtCaseReferenceNumber(value as Amendments["offenceCourtCaseReferenceNumber"], aho)
        break
      case "courtCaseReference":
        amendCourtCaseReference(value as Amendments["courtCaseReference"], aho)
        break
      case "resultQualifierCode":
        amendResultQualifierCode(value as Amendments["resultQualifierCode"], aho)
        removeEmptyResultQualifierVariable(aho)
        break
      case "nextSourceOrganisation":
        amendNextResultSourceOrganisation(value as Amendments["nextSourceOrganisation"], aho)
        break
      case "nextHearingDate":
        amendNextHearingDate(value as Amendments["nextHearingDate"], aho)
        break
      case "courtPNCIdentifier":
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.CourtPNCIdentifier =
          value as Amendments["courtPNCIdentifier"]
        break
      case "resultVariableText":
        amendResultVariableText(value as Amendments["resultVariableText"], aho)
        break
      case "courtReference":
        amendCourtReference(value as Amendments["courtReference"], aho)
        break
      case "courtOffenceSequenceNumber":
        amendCourtOffenceSequenceNumber(value as Amendments["courtOffenceSequenceNumber"], aho)
        break
      case "forceOwner":
        amendForceOwner(value as string, aho)
        break
      default:
        return
    }
  }

const applyAmendmentsToAho = <T extends AnnotatedHearingOutcome | PncUpdateDataset>(
  amendments: Amendments,
  aho: T
): T | Error => {
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
