import type {
  nextHearingDetailsSchema,
  offenceParsedXmlSchema,
  resultedCaseMessageParsedXmlSchema,
  resultParsedXmlSchema,
  spiAddressSchema,
  spiCourtIndividualDefendantSchema
} from "src/schemas/spiResult"
import { incomingMessageParsedXmlSchema } from "src/schemas/spiResult"
import type { z } from "zod"

export type ResultParsedXml = z.infer<typeof resultParsedXmlSchema>
export type OffenceParsedXml = z.infer<typeof offenceParsedXmlSchema>
export type SpiAddress = z.infer<typeof spiAddressSchema>
export type SpiCourtIndividualDefendant = z.infer<typeof spiCourtIndividualDefendantSchema>
export type SpiOffence = z.infer<typeof offenceParsedXmlSchema>
export type SpiResult = z.infer<typeof resultParsedXmlSchema>
export type SpiNextHearingDetails = z.infer<typeof nextHearingDetailsSchema>
export type ResultedCaseMessageParsedXml = z.infer<typeof resultedCaseMessageParsedXmlSchema>
export type IncomingMessageParsedXml = z.infer<typeof incomingMessageParsedXmlSchema>

export { incomingMessageParsedXmlSchema }
