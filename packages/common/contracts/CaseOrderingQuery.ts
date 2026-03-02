import z from "zod"

const OrderOptions = ["asc", "desc"] as const

const OrderByOptions = ["courtDate", "courtName", "defendantName", "messageReceivedTimestamp", "ptiurn"] as const

export const CaseOrderingQuerySchema = z.object({
  order: z.enum(OrderOptions).optional().default("asc"),
  orderBy: z.enum(OrderByOptions).optional()
})

export type CaseOrder = (typeof OrderOptions)[number]
export type CaseOrderBy = (typeof OrderByOptions)[number]
export type CaseOrderingQuery = z.infer<typeof CaseOrderingQuerySchema>
