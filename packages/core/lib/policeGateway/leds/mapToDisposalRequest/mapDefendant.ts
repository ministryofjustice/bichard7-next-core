import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type { Defendant } from "../../../../types/leds/DisposalRequest"

const mapDefendant = (pncUpdateDataset: PncUpdateDataset): Defendant => {
  const hearingDefendant = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const defendantFirstNames = hearingDefendant.DefendantDetail?.PersonName.GivenName
  const defendantLastName = hearingDefendant.DefendantDetail?.PersonName.FamilyName
  const defendantOrganisationName = hearingDefendant.OrganisationName

  if (defendantLastName !== undefined) {
    return {
      defendantType: "individual",
      defendantFirstNames,
      defendantLastName
    }
  }

  return {
    defendantType: "organisation",
    defendantOrganisationName: defendantOrganisationName ?? ""
  }
}

export default mapDefendant
