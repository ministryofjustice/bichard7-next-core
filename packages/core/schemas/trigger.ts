import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { z } from "zod"

export const triggerCodeSchema = z.nativeEnum(TriggerCode)

export const triggerSchema = z.object({
  code: triggerCodeSchema,
  offenceSequenceNumber: z.number().optional()
})
