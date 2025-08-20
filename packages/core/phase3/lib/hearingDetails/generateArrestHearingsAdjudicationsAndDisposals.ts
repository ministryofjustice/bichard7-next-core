import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type { PncUpdateArrestHearingAdjudicationAndDisposal } from "../../types/HearingDetails"

import isResultCompatibleWithDisposal from "../../../lib/results/isResultCompatibleWithDisposal"
import getAdjustedRecordableOffencesForCourtCase from "../getAdjustedRecordableOffencesForCourtCase"
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
