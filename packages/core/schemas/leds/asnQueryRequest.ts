import z from "zod"

const caseStatusMarkerSchema = z.array(
  z.union([
    z.literal("impending-prosecution-detail"),
    z.literal("penalty-notice"),
    z.literal("result-unobtainable"),
    z.literal("court-case")
  ])
)

export const asnQueryRequestSchema = z.object({
  asn: z.string(),
  caseStatusMarkers: caseStatusMarkerSchema
})
