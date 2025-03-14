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
  asn: z.string().optional(),
  caseAge: z.array(z.string()).or(z.string()).optional(),
  caseState: z.nativeEnum(ResolutionStatus).optional(),
  courtName: z.string().optional(),
  defendantName: z.string().optional().openapi({ example: "De*Name" }),
  maxPerPage: z.coerce.number().min(25).max(200).default(50),
  order: z.nativeEnum(Order).optional(),
  orderBy: z.nativeEnum(OrderBy).optional(),
  pageNum: z.coerce.number().min(1).default(1),
  ptiurn: z.string().optional(),
  reason: z.nativeEnum(Reason).optional().default(Reason.All),
  reasonCodes: z.array(z.string()).or(z.string()).optional(),
  resolvedByUsername: z.string().optional()
})

export type CaseIndexQuerystring = z.infer<typeof CaseIndexQuerystringSchema>

export type Filters = Pick<
  CaseIndexQuerystring,
  "asn" | "caseState" | "courtName" | "defendantName" | "ptiurn" | "reason" | "reasonCodes" | "resolvedByUsername"
>
export type Pagination = Pick<CaseIndexQuerystring, "maxPerPage" | "pageNum">
export type SortOrder = Pick<CaseIndexQuerystring, "order" | "orderBy">
