import type { z } from "zod"

import type {
  defendantSchema,
  nextHearingDetailsSchema,
  offenceParsedXmlSchema,
  resultedCaseMessageParsedXmlSchema,
  resultParsedXmlSchema,
  spiAddressSchema,
  spiCourtIndividualDefendantSchema
} from "../schemas/spiResult"

import { incomingMessageParsedXmlSchema } from "../schemas/spiResult"

export type IncomingMessageParsedXml = z.infer<typeof incomingMessageParsedXmlSchema>
export type OffenceParsedXml = z.infer<typeof offenceParsedXmlSchema>
export type ResultedCaseMessageParsedXml = z.infer<typeof resultedCaseMessageParsedXmlSchema>
export type ResultParsedXml = z.infer<typeof resultParsedXmlSchema>
export type SpiAddress = z.infer<typeof spiAddressSchema>
export type SpiCourtIndividualDefendant = z.infer<typeof spiCourtIndividualDefendantSchema>
export type SpiDefendant = z.infer<typeof defendantSchema>
export type SpiNextHearingDetails = z.infer<typeof nextHearingDetailsSchema>
export type SpiOffence = z.infer<typeof offenceParsedXmlSchema>
export type SpiResult = z.infer<typeof resultParsedXmlSchema>

export { incomingMessageParsedXmlSchema }
