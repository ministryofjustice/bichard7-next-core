import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"
import type { PncUpdateArrestHearingAdjudicationAndDisposal } from "../../types/HearingDetails"

import getAdjustedRecordableOffencesForCourtCase from "../../../lib/getAdjustedRecordableOffencesForCourtCase"
import isResultCompatibleWithDisposal from "../../../phase2/lib/isResultCompatibleWithDisposal"
import { createAdjudicationFromOffence } from "./createAdjudicationFromOffence"
import { createArrestHearingFromOffence } from "./createArrestHearingFromOffence"
import createDisposalsFromOffence from "./createDisposalsFromOffence"

export const generateArrestHearingsAdjudicationsAndDisposals = (
  pncUpdateDataset: PncUpdateDataset,
  courtCaseReference?: string
): PncUpdateArrestHearingAdjudicationAndDisposal[] =>
  getAdjustedRecordableOffencesForCourtCase(
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence,
    courtCaseReference
  )
    .filter((offence) => offence.AddedByTheCourt && isResultCompatibleWithDisposal(offence))
    .reduce(
      (
        arrestHearingsAdjudicationsAndDisposals: PncUpdateArrestHearingAdjudicationAndDisposal[],
        offenceAddedInCourt
      ) => {
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

        arrestHearingsAdjudicationsAndDisposals.push(
          ...createDisposalsFromOffence(pncUpdateDataset, offenceAddedInCourt)
        )

        return arrestHearingsAdjudicationsAndDisposals
      },
      []
    )
