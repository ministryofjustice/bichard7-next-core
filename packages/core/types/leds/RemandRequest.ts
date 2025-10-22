import type z from "zod"

import type {
  ledsCurrentAppearanceSchema,
  ledsNextAppearanceSchema,
  remandRequestSchema
} from "../../schemas/leds/remandRequest"

export type ledsCurrentAppearance = z.infer<typeof ledsCurrentAppearanceSchema>
export type ledsNextAppearance = z.infer<typeof ledsNextAppearanceSchema>
export type RemandRequest = z.infer<typeof remandRequestSchema>
