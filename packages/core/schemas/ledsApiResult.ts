import { z } from "zod"

const ledsApiAdjudication = z.object({
  adjudicationId: z.string(),
  appearanceNumber: z.number(),
  disposalDate: z.coerce.date(),
  adjudication: z.string()
})

const ledsApiDisposalDuration = z.object({
  units: z.string(),
  count: z.number()
})

const ledsApiDisposalResult = z.object({
  disposalId: z.string(),
  disposalCode: z.number(),
  disposalEffectiveDate: z.coerce.date().optional(),
  disposalDuration: ledsApiDisposalDuration.optional()
})

const ledsApiOffence = z.object({
  offenceId: z.string(),
  courtOffenceSequenceNumber: z.number(),
  cjsOffenceCode: z.string(),
  offenceStartDate: z.coerce.date(),
  offenceEndDate: z.coerce.date().optional(),
  offenceDescription: z.array(z.string()),
  plea: z.string(),
  adjudications: z.array(ledsApiAdjudication),
  disposalResults: z.array(ledsApiDisposalResult)
})

const ledsApiDisposal = z.object({
  courtCaseId: z.string(),
  courtCaseReference: z.string(),
  caseStatusMarker: z.string(),
  offences: z.array(ledsApiOffence)
})

export const ledsApiResultSchema = z.object({
  personId: z.string(),
  personUrn: z.string(),
  reportId: z.string(),
  asn: z.string(),
  ownerCode: z.string(),
  disposals: z.array(ledsApiDisposal)
})
