import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import { z } from "zod"

export const triggerCodeSchema = z.nativeEnum(TriggerCode)

export const triggerSchema = z.object({
  code: triggerCodeSchema,
  offenceSequenceNumber: z.number().optional()
})
