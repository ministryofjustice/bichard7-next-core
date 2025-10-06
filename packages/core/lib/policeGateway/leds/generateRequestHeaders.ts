import type { RequestHeaders } from "../../../types/leds/RequestHeaders"

const generateRequestHeaders = (correlationId: string): RequestHeaders => ({
  Accept: "application/json",
  "X-Leds-Correlation-Id": correlationId,
  "X-Leds-Action-Code": "",
  "X-Leds-Activity-Code": "",
  "X-Leds-Activity-Flow-Id": "",
  "X-Leds-Application-Datetime": "",
  "X-Leds-Justification": "",
  "X-Leds-Reason": "",
  "X-Leds-Session-Id": "",
  "X-Leds-System-Name": ""
})

export default generateRequestHeaders
