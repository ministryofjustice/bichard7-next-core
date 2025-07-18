import { z } from "zod"

const ledsApiOffence = z.object({
  offenceId: z.string(),
  courtOffenceSequenceNumber: z.string(),
  cjsOffenceCode: z.string(),
  offenceStartDate: z.coerce.date(),
  offenceEndDate: z.coerce.date().optional(),
  offenceDescription: z.array(z.string())
})

const ledsApiDisposal = z.object({
  courtCaseId: z.string(),
  courtCaseReference: z.string(),
  caseStatusMarker: z.string(),
  offences: z.array(ledsApiOffence)
})

export const ledsApiResultSchema = z.object({
  personId: z.string(),
  reportId: z.string(),
  asn: z.string(),
  ownerCode: z.string(),
  disposals: z.array(ledsApiDisposal)
})
