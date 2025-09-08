import z from "zod"

import isAsnValid from "../../phase1/lib/isAsnValid"

const caseStatusMarkers = ["impending-prosecution-detail", "penalty-notice", "court-case"] as const
const caseStatusMarkerSchema = z
  .array(z.enum(caseStatusMarkers))
  .refine(
    (items) =>
      items.length === caseStatusMarkers.length &&
      caseStatusMarkers.every((caseStatusMarker) => items.includes(caseStatusMarker)),
    `Array must contain exactly: ${caseStatusMarkers.join(", ")}`
  )

export const asnQueryRequestSchema = z.object({
  asn: z.string().refine((asn) => isAsnValid(asn), "Invalid ASN"),
  caseStatusMarkers: caseStatusMarkerSchema
})
