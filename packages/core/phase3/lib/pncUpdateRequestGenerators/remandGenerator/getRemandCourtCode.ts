import type { Hearing, Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import isDatedWarrantIssued from "../../../../lib/isDatedWarrantIssued"
import getPncCourtCode, { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../getPncCourtCode"

const getRemandCourtCode = (hearing: Hearing, results: Result[]) =>
  isDatedWarrantIssued(results[0].CJSresultCode)
    ? PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
    : getPncCourtCode(hearing.CourtHearingLocation, hearing.CourtHouseCode)

export default getRemandCourtCode
