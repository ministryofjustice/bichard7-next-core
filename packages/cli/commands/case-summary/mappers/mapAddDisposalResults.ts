import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type Metadata from "../types/Metadata"
import type SensitiveFn from "../types/SensitiveFn"
import { getCourtDetailsByLjaCode } from "../utils/courtDetails"
import mapOffence from "./mapOffence"

const mapAddDisposalResults = async (request: AddDisposalRequest, errors: string[], timestamp: string, sensitive: SensitiveFn) => {
  const metadata: Metadata = {
    title: `${errors.length > 0 ? "❌" : "✅"} Bichard Update: Add Disposal Results`,
    timestamp: timestamp,
    errors: errors
  }

  return {
    metadata,
    "Conviction date": request.dateOfConviction,
    "Court case reference": sensitive(request.courtCaseReference, true),
    "Person URN": sensitive(request.longPersonUrn, true),
    "Force owner": request.ownerCode,
    "Carried forward": request.carryForward
      ? {
          "Appearance date": `${request.carryForward.appearanceDate}`,
          Court:
            request.carryForward.court?.courtIdentityType === "code"
              ? await getCourtDetailsByLjaCode(request.carryForward.court.courtCode)
              : request.carryForward.court?.courtName
        }
      : undefined,
    "Referred to court case reference": request.referToCourtCase?.text,
    Offences: request.offences
      ? await Promise.all(request.offences?.map((offence, offenceIndex) => mapOffence(offence, offenceIndex, sensitive)))
      : undefined,
    "Additional Offences":
      request.additionalArrestOffences && request.additionalArrestOffences.length > 0
        ? await Promise.all(
            request.additionalArrestOffences[0].additionalOffences.map((offence, offenceIndex) => mapOffence(offence, offenceIndex, sensitive))
          )
        : undefined
  }
}

export default mapAddDisposalResults
