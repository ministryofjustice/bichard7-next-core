import { encode, type ParsedUrlQuery } from "querystring"
import { deleteQueryParamsByName } from "utils/deleteQueryParam"
import type { ReasonCodeTitle } from "./reasonCodes"

export const unlockCaseWithReasonPath = (
  reason: ReasonCodeTitle,
  caseId: number,
  query: ParsedUrlQuery,
  basePath: string
) => {
  const searchParams = new URLSearchParams(encode(query))
  deleteQueryParamsByName(["unlockException", "unlockTrigger"], searchParams)

  searchParams.append(`unlock${reason.replace(/s$/, "")}`, String(caseId))
  return `${basePath}/?${searchParams}`
}
