import z from "zod"

import type { ResolutionReasonKey } from "../types/ManualResolution"

import { ResolutionReasons } from "../types/ManualResolution"

const reasonKeys = Object.keys(ResolutionReasons) as [ResolutionReasonKey, ...ResolutionReasonKey[]]

export const ExceptionsManualResolveBodySchema = z.object({
  reason: z.enum(reasonKeys),
  reasonText: z.string().optional()
})
export type ExceptionsManualResolveBody = z.infer<typeof ExceptionsManualResolveBodySchema>
