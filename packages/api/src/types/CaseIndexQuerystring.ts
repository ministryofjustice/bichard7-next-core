import z from "zod"

import { ResolutionStatus } from "../useCases/dto/convertResolutionStatus"

export enum Order {
  asc = "asc",
  desc = "desc"
}

export enum OrderBy {
  courtDate = "courtDate",
  courtName = "courtName",
  defendantName = "defendantName",
  ptiurn = "ptiurn"
}

export enum Reason {
  All = "All",
  Exceptions = "Exceptions",
  Triggers = "Triggers"
}

export const CaseIndexQuerystringSchema = z.object({
  caseState: z.nativeEnum(ResolutionStatus).optional(),
  courtName: z.string().optional(),
  defendantName: z.string().optional().openapi({ example: "De*Name" }),
  maxPerPage: z.coerce.number().min(25).max(200).default(50),
  order: z.nativeEnum(Order).optional(),
  orderBy: z.nativeEnum(OrderBy).optional(),
  pageNum: z.coerce.number().min(1).default(1),
  reason: z.nativeEnum(Reason).optional(),
  reasonCodes: z.array(z.string()).optional()
})

export type CaseIndexQuerystring = z.infer<typeof CaseIndexQuerystringSchema>

export type Filters = Pick<CaseIndexQuerystring, "caseState" | "courtName" | "defendantName" | "reason" | "reasonCodes">
export type Pagination = Pick<CaseIndexQuerystring, "maxPerPage" | "pageNum">
export type SortOrder = Pick<CaseIndexQuerystring, "order" | "orderBy">
