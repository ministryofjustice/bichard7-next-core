import { dateLikeToDate } from "@moj-bichard7/common/schemas/dateLikeToDate"
import { CaseAge } from "@moj-bichard7/common/types/CaseAge"
import z from "zod"

import { ResolutionStatus } from "../useCases/dto/convertResolutionStatus"

export enum LockedState {
  All = "All",
  Locked = "Locked",
  LockedToMe = "LockedToMe",
  Unlocked = "Unlocked"
}

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
  allocatedUsername: z.string().optional(),
  asn: z.string().optional(),
  caseAge: z.array(z.nativeEnum(CaseAge)).optional(),
  caseState: z.nativeEnum(ResolutionStatus).optional(),
  courtName: z.string().optional(),
  defendantName: z.string().optional().openapi({ description: "Format: 'De*Name'" }),
  from: dateLikeToDate.optional().openapi({ description: "Format: '2025-03-13'" }),
  lockedState: z.nativeEnum(LockedState).optional(),
  maxPerPage: z.coerce.number().min(25).max(200).default(50),
  order: z.nativeEnum(Order).optional(),
  orderBy: z.nativeEnum(OrderBy).optional(),
  pageNum: z.coerce.number().min(1).default(1),
  ptiurn: z.string().optional(),
  reason: z.nativeEnum(Reason).optional().default(Reason.All),
  reasonCodes: z.array(z.string()).or(z.string()).optional(),
  resolvedByUsername: z.string().optional(),
  resolvedFrom: dateLikeToDate.optional().openapi({ description: "Format: '2025-03-13'" }),
  resolvedTo: dateLikeToDate.optional().openapi({ description: "Format: '2025-03-13'" }),
  to: dateLikeToDate.optional().openapi({ description: "Format: '2025-03-13'" })
})

export type CaseIndexQuerystring = z.infer<typeof CaseIndexQuerystringSchema>

export type Filters = Pick<
  CaseIndexQuerystring,
  | "allocatedUsername"
  | "asn"
  | "caseAge"
  | "caseState"
  | "courtName"
  | "defendantName"
  | "from"
  | "lockedState"
  | "ptiurn"
  | "reason"
  | "reasonCodes"
  | "resolvedByUsername"
  | "resolvedFrom"
  | "resolvedTo"
  | "to"
>
export type Pagination = Pick<CaseIndexQuerystring, "maxPerPage" | "pageNum">
export type SortOrder = Pick<CaseIndexQuerystring, "order" | "orderBy">
