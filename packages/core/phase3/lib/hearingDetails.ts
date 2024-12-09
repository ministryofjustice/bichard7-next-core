import type { AnnotatedHearingOutcome, Offence, OffenceReason } from "../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import type {
  Adjudication,
  ArrestHearing,
  ArrestHearingAdjudicationAndDisposal,
  CourtHearing,
  CourtHearingAdjudicationAndDisposal,
  CourtHearingAndDisposal,
  Disposal
} from "../types/HearingDetails"

import getAdjustedRecordableOffencesForCourtCase from "../../lib/getAdjustedRecordableOffencesForCourtCase"
import createPncAdjudicationFromAho from "../../phase2/lib/createPncAdjudicationFromAho"
import formatDateSpecifiedInResult from "../../phase2/lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import isResultCompatibleWithDisposal from "../../phase2/lib/isResultCompatibleWithDisposal"
import { HearingDetailsType } from "../types/HearingDetails"
import createPncDisposalFromOffence from "./createPncDisposalFromOffence"
import getForceStationCode from "./getForceStationCode"

const DEFAULT_OFFENCE_LOCATION = "Not provided by Court"
const OFFENCE_START_TIME_FIELD_LENGTH = 4
const MIDNIGHT_TIME_STRING = "0000"
const ONE_MINUTE_PAST_MIDNIGHT_TIME_STRING = "0001"

const preProcessTimeString = (timeString?: string) =>
  timeString
    ? timeString
        ?.replace(/:/g, "")
        .padStart(OFFENCE_START_TIME_FIELD_LENGTH, "0")
        .replace(MIDNIGHT_TIME_STRING, ONE_MINUTE_PAST_MIDNIGHT_TIME_STRING)
    : ""

const preProcessOffenceReasonSequence = (offence: Offence): string =>
  offence.CriminalProsecutionReference.OffenceReasonSequence?.padStart(3, "0") ?? ""

const convertHoOffenceCodeToPncFormat = (offCode?: OffenceReason): string => {
  if (!offCode) {
    return ""
  }

  if (offCode.__type !== "NationalOffenceReason") {
    return offCode.LocalOffenceCode.OffenceCode
  }

  const offenceReason: (string | undefined)[] = []
  if (offCode.OffenceCode.__type === "NonMatchingOffenceCode" && offCode.OffenceCode.ActOrSource) {
    offenceReason.push(offCode.OffenceCode.ActOrSource)
    offenceReason.push(offCode.OffenceCode.Year)
  } else if (offCode.OffenceCode.__type === "IndictmentOffenceCode" && offCode.OffenceCode.Indictment) {
    offenceReason.push(offCode.OffenceCode.Indictment)
  } else if (offCode.OffenceCode.__type === "CommonLawOffenceCode" && offCode.OffenceCode.CommonLawOffence) {
    offenceReason.push(offCode.OffenceCode.CommonLawOffence)
  }

  offenceReason.push(offCode.OffenceCode.Reason)
  offenceReason.push(offCode.OffenceCode.Qualifier)

  return offenceReason.join("")
}

const createCourtHearingFromOffence = (offence: Offence): CourtHearing => ({
  offenceReason: convertHoOffenceCodeToPncFormat(offence.CriminalProsecutionReference.OffenceReason),
  courtOffenceSequenceNumber: preProcessOffenceReasonSequence(offence),
  type: HearingDetailsType.ORDINARY
})

const createArrestHearingFromOffence = (pncUpdateDataset: PncUpdateDataset, offence: Offence): ArrestHearing => {
  const offenceStartDate = formatDateSpecifiedInResult(offence.ActualOffenceStartDate.StartDate, true)
  const offenceEndDate = offence.ActualOffenceEndDate?.EndDate
    ? formatDateSpecifiedInResult(offence.ActualOffenceEndDate.EndDate, true)
    : ""
  const offenceTimeStartTime = offence.OffenceTime ?? offence.StartTime ?? ""

  return {
    committedOnBail: offence.CommittedOnBail?.toUpperCase() === "Y" ? "Y" : "N",
    courtOffenceSequenceNumber: preProcessOffenceReasonSequence(offence) || null,
    locationOfOffence: offence.LocationOfOffence ?? DEFAULT_OFFENCE_LOCATION,
    offenceEndDate,
    offenceEndTime: preProcessTimeString(offence.OffenceEndTime),
    offenceLocationFSCode: getForceStationCode(pncUpdateDataset, false),
    offenceReason: convertHoOffenceCodeToPncFormat(offence.CriminalProsecutionReference.OffenceReason),
    offenceReasonSequence: preProcessOffenceReasonSequence(offence) || "",
    offenceStartDate,
    offenceStartTime: preProcessTimeString(offenceTimeStartTime),
    type: HearingDetailsType.ARREST
  }
}

const createDisposalsFromOffence = (aho: AnnotatedHearingOutcome, offence: Offence): Disposal[] =>
  createPncDisposalFromOffence(aho, offence).map((disposal) => ({
    disposalType: disposal.type?.toString() ?? "",
    disposalQuantity: disposal.qtyUnitsFined ?? "",
    disposalQualifiers: disposal.qualifiers ?? "",
    disposalText: disposal.text ?? "",
    type: HearingDetailsType.DISPOSAL
  }))

const createAdjudicationFromOffence = (offence: Offence, dateOfHearing: Date): Adjudication | undefined => {
  const adjudication = createPncAdjudicationFromAho(offence.Result, dateOfHearing)

  if (adjudication) {
    return {
      hearingDate: adjudication.sentenceDate ? formatDateSpecifiedInResult(adjudication.sentenceDate, true) : "",
      numberOffencesTakenIntoAccount: adjudication.offenceTICNumber?.toString().padStart(4, "0") ?? "",
      pleaStatus: adjudication.plea,
      type: HearingDetailsType.ADJUDICATION,
      verdict: adjudication.verdict
    }
  }
}

export const generateHearingsAndDisposals = (
  pncUpdateDataset: PncUpdateDataset,
  courtCaseReference?: string
): CourtHearingAndDisposal[] =>
  getAdjustedRecordableOffencesForCourtCase(
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence,
    courtCaseReference
  )
    .filter((offence) => !offence.AddedByTheCourt)
    .reduce((courtHearingsAndDisposals: CourtHearingAndDisposal[], offence) => {
      courtHearingsAndDisposals.push(createCourtHearingFromOffence(offence))
      courtHearingsAndDisposals.push(...createDisposalsFromOffence(pncUpdateDataset, offence))

      return courtHearingsAndDisposals
    }, [])

export const generateHearingsAdjudicationsAndDisposals = (
  pncUpdateDataset: PncUpdateDataset,
  courtCaseReference?: string
): CourtHearingAdjudicationAndDisposal[] =>
  getAdjustedRecordableOffencesForCourtCase(
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence,
    courtCaseReference
  )
    .filter((offence) => !offence.AddedByTheCourt)
    .reduce((courtHearingsAndDisposals: CourtHearingAdjudicationAndDisposal[], offence) => {
      courtHearingsAndDisposals.push(createCourtHearingFromOffence(offence))

      const adjudication = createAdjudicationFromOffence(
        offence,
        pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
      )

      if (adjudication) {
        courtHearingsAndDisposals.push(adjudication)
      }

      courtHearingsAndDisposals.push(...createDisposalsFromOffence(pncUpdateDataset, offence))

      return courtHearingsAndDisposals
    }, [])

export const generateArrestHearingsAdjudicationsAndDisposals = (
  pncUpdateDataset: PncUpdateDataset,
  courtCaseReference?: string
): ArrestHearingAdjudicationAndDisposal[] =>
  getAdjustedRecordableOffencesForCourtCase(
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence,
    courtCaseReference
  )
    .filter((offence) => offence.AddedByTheCourt && isResultCompatibleWithDisposal(offence))
    .reduce((arrestHearingsAdjudicationsAndDisposals: ArrestHearingAdjudicationAndDisposal[], offenceAddedInCourt) => {
      arrestHearingsAdjudicationsAndDisposals.push(
        createArrestHearingFromOffence(pncUpdateDataset, offenceAddedInCourt)
      )

      const adjudication = createAdjudicationFromOffence(
        offenceAddedInCourt,
        pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
      )

      if (adjudication) {
        arrestHearingsAdjudicationsAndDisposals.push(adjudication)
      }

      arrestHearingsAdjudicationsAndDisposals.push(...createDisposalsFromOffence(pncUpdateDataset, offenceAddedInCourt))

      return arrestHearingsAdjudicationsAndDisposals
    }, [])
