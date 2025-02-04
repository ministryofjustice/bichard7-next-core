import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"
import type { PncUpdateCourtHearingAndDisposal } from "../../types/HearingDetails"

import getAdjustedRecordableOffencesForCourtCase from "../getAdjustedRecordableOffencesForCourtCase"
import { createCourtHearingFromOffence } from "./createCourtHearingFromOffence"
import createDisposalsFromOffence from "./createDisposalsFromOffence"

export const generateHearingsAndDisposals = (
  pncUpdateDataset: PncUpdateDataset,
  courtCaseReference?: string
): PncUpdateCourtHearingAndDisposal[] =>
  getAdjustedRecordableOffencesForCourtCase(
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence,
    courtCaseReference
  )
    .filter((offence) => !offence.AddedByTheCourt)
    .reduce((courtHearingsAndDisposals: PncUpdateCourtHearingAndDisposal[], offence) => {
      courtHearingsAndDisposals.push(createCourtHearingFromOffence(offence))
      courtHearingsAndDisposals.push(...createDisposalsFromOffence(pncUpdateDataset, offence))

      return courtHearingsAndDisposals
    }, [])
