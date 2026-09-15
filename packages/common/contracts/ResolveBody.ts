import z from "zod"

import type { ResolutionReasonKey } from "../types/ManualResolution"

import { ResolutionReasons } from "../types/ManualResolution"
import { ResolutionStatus } from "../types/ResolutionStatus"

const reasonKeys = Object.keys(ResolutionReasons) as [ResolutionReasonKey, ...ResolutionReasonKey[]]

export const ResolveBodySchema = z.object({
  reason: z.enum(reasonKeys),
  reasonText: z.string().optional(),
  resolutionStatus: z.enum(ResolutionStatus)
})
export type ResolveBody = z.infer<typeof ResolveBodySchema>
