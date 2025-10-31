import type z from "zod"

import type {
  appearanceResultSchema,
  currentAppearanceSchema,
  nextAppearanceSchema,
  remandRequestSchema
} from "../../schemas/leds/remandRequest"

export type AppearanceResult = z.infer<typeof appearanceResultSchema>
export type CurrentAppearance = z.infer<typeof currentAppearanceSchema>
export type NextAppearance = z.infer<typeof nextAppearanceSchema>
export type RemandRequest = z.infer<typeof remandRequestSchema>
