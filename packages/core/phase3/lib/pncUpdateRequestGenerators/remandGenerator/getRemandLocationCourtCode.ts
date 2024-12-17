import isDatedWarrantIssued from "../../../../lib/isDatedWarrantIssued"
import type { Hearing, Result } from "../../../../types/AnnotatedHearingOutcome"
import getPncCourtCode, { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../getPncCourtCode"

const getRemandLocationCourtCode = (hearing: Hearing, results: Result[]) =>
  isDatedWarrantIssued(results[0].CJSresultCode)
    ? PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
    : getPncCourtCode(hearing.CourtHearingLocation, hearing.CourtHouseCode)

export default getRemandLocationCourtCode
