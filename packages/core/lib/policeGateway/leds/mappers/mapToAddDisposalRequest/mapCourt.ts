import type { Court } from "../../../../../types/leds/DisposalRequest"

import { PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR } from "../../../../../phase3/lib/getPncCourtCode"

const mapCourt = (code: null | string, name: null | string): Court => {
  return code === PNC_COURT_CODE_WHEN_DEFENDANT_FAILED_TO_APPEAR
    ? {
        courtIdentityType: "name",
        courtName: name ?? ""
      }
    : {
        courtIdentityType: "code",
        courtCode: code ?? ""
      }
}

export default mapCourt
