import z from "zod"

export const triggerQualityValues = {
  Fail: 2,
  "Not Checked": 1,
  "Partial Pass (Not all Triggers)": 6,
  Pass: 2
} as const

export const TriggerQualitySchema = z.union(Object.values(triggerQualityValues).map((value) => z.literal(value)))

export type TriggerQuality = z.infer<typeof TriggerQualitySchema>
