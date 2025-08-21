import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import getForceStationCode from "./getForceStationCode"
import getPncCheckname from "./getPncCheckname"
import preProcessPncIdentifier from "./preProcessPncIdentifier"

const generateBasePncUpdateRequest = (pncUpdateDataset: PncUpdateDataset) => ({
  croNumber: pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.CRONumber ?? null,
  forceStationCode: getForceStationCode(pncUpdateDataset, true),
  pncCheckName: getPncCheckname(pncUpdateDataset),
  pncIdentifier: preProcessPncIdentifier(
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier
  )
})

export default generateBasePncUpdateRequest
