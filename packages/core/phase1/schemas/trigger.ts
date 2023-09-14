import { z } from "zod"
import { TriggerCode } from "../../types/TriggerCode"

export const triggerCodeSchema = z.nativeEnum(TriggerCode)

export const triggerSchema = z.object({
  code: triggerCodeSchema,
  offenceSequenceNumber: z.number().optional()
})
