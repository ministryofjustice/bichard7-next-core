import z from "zod"

export const triggerQualityValues = {
  Fail: 3,
  "Not Checked": 1,
  "Partial Pass (Not all Triggers)": 4,
  Pass: 2
} as const

export const TriggerQualitySchema = z.union(Object.values(triggerQualityValues).map((value) => z.literal(value)))

export type TriggerQuality = z.infer<typeof TriggerQualitySchema>
