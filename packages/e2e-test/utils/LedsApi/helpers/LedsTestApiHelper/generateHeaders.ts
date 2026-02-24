import { randomUUID } from "crypto"
import { isError } from "../../../isError"

export type EndpointHeaders = {
  "X-Leds-Action-Code": string
  "X-Leds-Activity-Code": string
  "X-Leds-Justification": string
  "X-Leds-Reason": string
}

export const ENDPOINT_HEADERS: Record<string, EndpointHeaders> = {
  createArrestedPerson: {
    "X-Leds-Action-Code": "Create Arrested Person",
    "X-Leds-Activity-Code": "Person Create",
    "X-Leds-Justification": "Create arrested person",
    "X-Leds-Reason": "0 - Transaction log and other audit checks"
  },
  addOffence: {
    "X-Leds-Action-Code": "Create Offence",
    "X-Leds-Activity-Code": "Person Update",
    "X-Leds-Justification": "Create impending prosecution",
    "X-Leds-Reason": "0 - Transaction log and other audit checks"
  },
  offenceLoop: {
    "X-Leds-Action-Code": "View Offence Details",
    "X-Leds-Activity-Code": "Person Enquiry",
    "X-Leds-Justification": "Offence enquiry loop",
    "X-Leds-Reason": "0 - Transaction log and other audit checks"
  },
  arrestSummaries: {
    "X-Leds-Action-Code": "View Arrest / Summons Summary",
    "X-Leds-Activity-Code": "Person Enquiry",
    "X-Leds-Justification": "Arrest summary",
    "X-Leds-Reason": "0 - Transaction log and other audit checks"
  },
  disposals: {
    "X-Leds-Action-Code": "Create Disposal",
    "X-Leds-Activity-Code": "Person Update",
    "X-Leds-Justification": "Create impending prosecution",
    "X-Leds-Reason": "0 - Transaction log and other audit checks"
  },
  addDisposalResults: {
    "X-Leds-Action-Code": "Add Disposal Results",
    "X-Leds-Activity-Code": "Person Update",
    "X-Leds-Justification": "Add disposal results",
    "X-Leds-Reason": "0 - Transaction log and other audit checks"
  },
  disposalHistory: {
    "X-Leds-Action-Code": "View Disposal History",
    "X-Leds-Activity-Code": "Person Enquiry",
    "X-Leds-Justification": "View disposal history",
    "X-Leds-Reason": "0 - Transaction log and other audit checks"
  }
}

const generateHeaders = (endpointHeaders: Record<string, unknown>, authToken: string) => {
  if (isError(authToken)) {
    throw Error(`Could not generate auth token. ${authToken.message}`)
  }

  return {
    Authorization: `Bearer ${authToken}`,
    Accept: "application/json",
    "X-Leds-Session-Id": randomUUID(),
    "X-Leds-System-Name": "Bichard7",
    "X-Leds-Application-Datetime": new Date().toISOString(),
    "X-Leds-On-Behalf-Of": "Bichard7",
    "X-Leds-Activity-Flow-Id": randomUUID(),
    "X-Leds-Reference-Id": randomUUID(),
    "X-Leds-Correlation-Id": randomUUID(),
    "Content-Type": "application/json",
    ...endpointHeaders
  }
}

export default generateHeaders
