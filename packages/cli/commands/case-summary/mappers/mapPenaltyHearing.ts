import type Metadata from "../types/Metadata"
import type SensitiveFn from "../types/SensitiveFn"

const mapPenaltyHearing = (request: string, errors: string[], timestamp: string, sensitive: SensitiveFn) => {
  const metadata: Metadata = {
    title: `${errors.length > 0 ? "❌" : "✅"} Bichard Update: Penalty Hearing`,
    timestamp: timestamp,
    errors: errors
  }

  return {
    metadata,
    "XML request": sensitive(request)
  }
}

export default mapPenaltyHearing
