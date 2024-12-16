import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"
import type { CourtHearingAdjudicationAndDisposal } from "../../types/HearingDetails"

import getAdjustedRecordableOffencesForCourtCase from "../../../lib/getAdjustedRecordableOffencesForCourtCase"
import { createAdjudicationFromOffence } from "./createAdjudicationFromOffence"
import { createCourtHearingFromOffence } from "./createCourtHearingFromOffence"
import { createDisposalsFromOffence } from "./createDisposalsFromOffence"

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
