import type { Hearing, Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import isUndatedWarrantIssued from "../../../../lib/isUndatedWarrantIssued"
import getPncCourtCode, { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../getPncCourtCode"

const getPsaCourtCode = (hearing: Hearing, results: Result[]) => {
  return isUndatedWarrantIssued(results[0].CJSresultCode)
    ? PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
    : getPncCourtCode(results[0].NextResultSourceOrganisation, hearing.CourtHouseCode)
}

export default getPsaCourtCode
