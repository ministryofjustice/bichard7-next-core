import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"
import type { ArrestHearing } from "../../types/HearingDetails"

import formatDateSpecifiedInResult from "../../../phase2/lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import { HearingDetailsType } from "../../types/HearingDetails"
import getForceStationCode from "../getForceStationCode"
import { convertHoOffenceCodeToPncFormat } from "./convertHoOffenceCodeToPncFormat"
import { preProcessOffenceReasonSequence } from "./preProcessOffenceReasonSequence"

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

export const createArrestHearingFromOffence = (pncUpdateDataset: PncUpdateDataset, offence: Offence): ArrestHearing => {
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
    offenceReasonSequence: preProcessOffenceReasonSequence(offence),
    offenceStartDate,
    offenceStartTime: preProcessTimeString(offenceTimeStartTime),
    type: HearingDetailsType.ARREST
  }
}
