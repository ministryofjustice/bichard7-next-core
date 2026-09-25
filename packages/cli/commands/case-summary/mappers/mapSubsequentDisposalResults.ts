import type { SubsequentDisposalResultsRequest } from "@moj-bichard7/core/types/leds/SubsequentDisposalResultsRequest"
import type Metadata from "../types/Metadata"
import type SensitiveFn from "../types/SensitiveFn"
import { getCourtDetailsByLjaCode } from "../utils/courtDetails"
import mapOffence from "./mapOffence"

const mapSubsequentDisposalResults = async (
  request: SubsequentDisposalResultsRequest,
  type: "Subsequently Varied" | "Sentence Deferred",
  errors: string[],
  timestamp: string,
  sensitive: SensitiveFn
) => {
  const metadata: Metadata = {
    title: `${errors.length > 0 ? "❌" : "✅"} Bichard Update: ${type}`,
    timestamp: timestamp,
    errors: errors
  }

  return {
    metadata,
    "Conviction date": request.reasonForAppearance,
    "Court case reference": sensitive(request.courtCaseReference, true),
    "Person URN": sensitive(request.longPersonUrn, true),
    "Force owner": request.ownerCode,
    "Appearance date": `${request.appearanceDate}`,
    Court: request.court?.courtIdentityType === "code" ? await getCourtDetailsByLjaCode(request.court.courtCode) : request.court?.courtName,
    Offences: request.offences
      ? await Promise.all(request.offences?.map((offence, offenceIndex) => mapOffence(offence, offenceIndex, sensitive)))
      : undefined
  }
}

export default mapSubsequentDisposalResults
