import { randomUUID } from "node:crypto"

import type { RequestHeaders } from "../../../types/leds/RequestHeaders"

import LedsActionCode from "../../../types/leds/LedsActionCode"

type RequestHeadersResult = RequestHeaders & { Authorization: string }

const generateRequestHeaders = (
  correlationId: string,
  actionCode: LedsActionCode,
  authToken: string
): RequestHeadersResult => {
  let reason = "9 - Update/Confirm/Broadcast"
  let activityCode = "Person Update"

  if (actionCode === LedsActionCode.QueryByAsn) {
    reason = "8 - On behalf of another authorised agency"
    activityCode = "Person Enquiry"
  }

  return {
    Authorization: `Bearer ${authToken}`,
    Accept: "application/json",
    "X-Leds-Session-Id": randomUUID(),
    "X-Leds-System-Name": "Bichard7",
    "X-Leds-Application-Datetime": new Date().toISOString(),
    "X-Leds-Justification": "Automated court disposal from MoJ Bichard",
    "X-Leds-Reason": reason,
    "X-Leds-On-Behalf-Of": "Bichard7",
    "X-Leds-Activity-Flow-Id": randomUUID(),
    "X-Leds-Activity-Code": activityCode,
    "X-Leds-Action-Code": actionCode,
    "X-Leds-Reference-Id": randomUUID(),
    "X-Leds-Correlation-Id": correlationId
  }
}

export default generateRequestHeaders
