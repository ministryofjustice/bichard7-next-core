import z from "zod"

import { dateLikeToDate } from "../schemas/dateLikeToDate"
import { CaseAge } from "./CaseAge"

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

export enum ResolutionStatus {
  Resolved = "Resolved",
  Submitted = "Submitted",
  Unresolved = "Unresolved"
}

export const ApiCaseQuerystringSchema = z.object({
  allocatedUsername: z.string().optional(),
  asn: z.string().optional(),
  caseAge: z.array(z.nativeEnum(CaseAge)).optional(),
  caseState: z.nativeEnum(ResolutionStatus).optional(),
  courtName: z.string().optional(),
  defendantName: z.string().optional().describe("Format: 'De*Name'"),
  from: dateLikeToDate.optional().describe("Format: '2025-03-13'"),
  lockedState: z.nativeEnum(LockedState).optional(),
  maxPerPage: z.coerce.number().min(25).max(200).default(50),
  order: z.nativeEnum(Order).optional(),
  orderBy: z.nativeEnum(OrderBy).optional(),
  pageNum: z.coerce.number().min(1).default(1),
  ptiurn: z.string().optional(),
  reason: z.nativeEnum(Reason).optional().default(Reason.All),
  reasonCodes: z.array(z.string()).or(z.string()).optional(),
  resolvedByUsername: z.string().optional(),
  resolvedFrom: dateLikeToDate.optional().describe("Format: '2025-03-13'"),
  resolvedTo: dateLikeToDate.optional().describe("Format: '2025-03-13'"),
  to: dateLikeToDate.optional().describe("Format: '2025-03-13'")
})

export type ApiCaseQuerystring = z.infer<typeof ApiCaseQuerystringSchema>
