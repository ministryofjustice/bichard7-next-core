import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"
import type { CourtHearingAndDisposal } from "../../types/HearingDetails"

import getAdjustedRecordableOffencesForCourtCase from "../../../lib/getAdjustedRecordableOffencesForCourtCase"
import { createCourtHearingFromOffence } from "./createCourtHearingFromOffence"
import createDisposalsFromOffence from "./createDisposalsFromOffence"

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
