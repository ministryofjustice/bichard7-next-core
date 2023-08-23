import type { Request } from "express"
import type { CaseListQueryParams } from "src/types/CaseListQueryParams"

export interface CaseListQueryRequest extends Request {
  caseListQueryParams?: CaseListQueryParams
}
