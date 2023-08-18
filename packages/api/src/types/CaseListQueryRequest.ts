import type { Request } from "express"
import type { CaseListQueryParams } from "./CaseListQueryParams"

export interface CaseListQueryRequest extends Request {
  caseListQueryParams?: CaseListQueryParams
}
