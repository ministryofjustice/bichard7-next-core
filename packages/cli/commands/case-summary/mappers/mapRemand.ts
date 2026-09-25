import type { RemandRequest } from "@moj-bichard7/core/types/leds/RemandRequest"
import type Metadata from "../types/Metadata"
import type SensitiveFn from "../types/SensitiveFn"
import { getCourtDetailsByLjaCode } from "../utils/courtDetails"

const mapRemand = async (request: RemandRequest, errors: string[], timestamp: string, sensitive: SensitiveFn) => {
  const metadata: Metadata = {
    title: `${errors.length > 0 ? "❌" : "✅"} Bichard Update: Add remand`,
    timestamp: timestamp,
    errors
  }

  return {
    metadata,
    "Person URN": sensitive(request.longPersonUrn, true),
    "Force owner": request.ownerCode,
    "Remand date": request.remandDate,
    "Appearance result": request.appearanceResult,
    "Current appearance": {
      Court:
        request.currentAppearance.court?.courtIdentityType === "code"
          ? await getCourtDetailsByLjaCode(request.currentAppearance.court.courtCode)
          : request.currentAppearance.court?.courtName,
      Force: request.currentAppearance.forceStationCode
    },
    "Next appearance": request.nextAppearance
      ? {
          Date: request.nextAppearance.date,
          Court:
            request.nextAppearance.court?.courtIdentityType === "code"
              ? await getCourtDetailsByLjaCode(request.nextAppearance.court.courtCode)
              : request.nextAppearance.court?.courtName
        }
      : undefined,
    "Bail conditions": sensitive(request.bailConditions, true)
  }
}

export default mapRemand
