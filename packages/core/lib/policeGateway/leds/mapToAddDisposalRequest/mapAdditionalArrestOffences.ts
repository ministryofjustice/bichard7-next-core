import type { ArrestOffence } from "../../../../types/leds/AddDisposalRequest"
import type { AdditionalArrestOffences, Adjudication, Plea } from "../../../../types/leds/DisposalRequest"

import convertAsnToLongFormat from "../../../../phase1/enrichAho/enrichFunctions/enrichDefendant/convertAsnToLongFormat"
import { type PncUpdateArrestHearingAdjudicationAndDisposal } from "../../../../phase3/types/HearingDetails"
import convertLongAsnToLedsFormat from "../convertLongAsnToLedsFormat"
import { convertDate, convertTime } from "../dateTimeConverter"
import preProcessOffenceCode from "../preProcessOffenceCode"
import mapDisposalResult from "./mapDisposalResult"
import mergeOffenceDetails from "./mergeOffenceDetails"
import shouldExcludePleaAndAdjudication from "./shouldExcludePleaAndAdjudication"
import { toTitleCase } from "./toTitleCase"

const mapAdditionalArrestOffences = (
  asn: string,
  arrestsAdjudicationsAndDisposals: PncUpdateArrestHearingAdjudicationAndDisposal[],
  isCarriedForwardOrReferredToCourtCase: boolean
): AdditionalArrestOffences[] => {
  const arrestSummonsNumber = convertLongAsnToLedsFormat(convertAsnToLongFormat(asn))
  const additionalOffences = mergeOffenceDetails(arrestsAdjudicationsAndDisposals).map<ArrestOffence>(
    ({ arrest, adjudication, disposals }) => {
      const { offenceCode: cjsOffenceCode, roleQualifier } = preProcessOffenceCode(arrest.offenceReason)
      const disposalResults = disposals.map(mapDisposalResult)
      const excludePleaAndAdjudication = shouldExcludePleaAndAdjudication(
        disposalResults,
        isCarriedForwardOrReferredToCourtCase
      )
      const plea = !excludePleaAndAdjudication ? (toTitleCase(adjudication?.pleaStatus) as Plea) : undefined
      const verdict = !excludePleaAndAdjudication ? (toTitleCase(adjudication?.verdict) as Adjudication) : undefined

      return {
        courtOffenceSequenceNumber: Number(arrest.courtOffenceSequenceNumber),
        offenceCode: {
          offenceCodeType: "cjs",
          cjsOffenceCode
        },
        roleQualifiers: roleQualifier ? [roleQualifier] : undefined,
        committedOnBail: arrest.committedOnBail?.toLowerCase() === "y",
        plea,
        adjudication: verdict,
        dateOfSentence: adjudication?.hearingDate ? convertDate(adjudication.hearingDate) : undefined,
        offenceTic: Number(adjudication?.numberOffencesTakenIntoAccount),
        offenceStartDate: convertDate(arrest.offenceStartDate),
        offenceStartTime: arrest.offenceStartTime ? convertTime(arrest.offenceStartTime) : undefined,
        offenceEndDate: arrest.offenceEndDate ? convertDate(arrest.offenceEndDate) : undefined,
        offenceEndTime: arrest.offenceEndTime ? convertTime(arrest.offenceEndTime) : undefined,
        disposalResults,
        locationFsCode: arrest.offenceLocationFSCode,
        locationText: { locationText: arrest.locationOfOffence }
      }
    }
  )

  return [{ asn: arrestSummonsNumber, additionalOffences }]
}

export default mapAdditionalArrestOffences
