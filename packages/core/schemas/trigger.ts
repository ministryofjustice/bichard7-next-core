import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import * as z from "zod/v4"

export const triggerCodeSchema = z.nativeEnum(TriggerCode)

export const triggerSchema = z.object({
  code: triggerCodeSchema,
  offenceSequenceNumber: z.number().optional()
})
