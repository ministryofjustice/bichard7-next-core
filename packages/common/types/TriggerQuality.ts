import z from "zod"

export const triggerQualityValues = {
  1: "Not Checked",
  2: "Pass",
  3: "Fail",
  4: "Partial Pass (Not all Triggers)"
} as const

const triggerQualityKeys = Object.keys(triggerQualityValues).map(Number) as (keyof typeof triggerQualityValues)[]

export const TriggerQualitySchema = z.union(triggerQualityKeys.map((value) => z.literal(value)))

export type TriggerQuality = z.infer<typeof TriggerQualitySchema>
