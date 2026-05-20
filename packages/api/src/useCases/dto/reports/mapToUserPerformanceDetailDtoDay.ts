import type { CodeDetailDto, UserPerformanceDetailDto } from "@moj-bichard7/common/types/reports/UserPerformanceDetail"

import type { UserDetailJsonRow } from "../../../types/reports/UserDetail"

import ExceptionMap from "../../data/getExceptionDescriptionMap"
import TriggerMap from "../../data/getTriggerDescriptionMap"

export const mapToUserPerformanceDetailDtoDay = (date: Date, row?: UserDetailJsonRow): UserPerformanceDetailDto => {
  if (!row) {
    return {
      codeDetails: [] as CodeDetailDto[],
      date,
      totals: { resolved: 0, totalLocked: 0 }
    }
  }

  const codeDetails: CodeDetailDto[] = []
  let totalLocked = 0
  let resolved = 0

  for (const exc of row.exceptions) {
    totalLocked += exc.totals.totalLocked
    resolved += exc.totals.resolved

    codeDetails.push({
      ...exc,
      description: ExceptionMap.get(exc.code) ?? "Description unavailable",
      type: "exception" as const
    })
  }

  for (const trig of row.triggers) {
    totalLocked += trig.totals.totalLocked
    resolved += trig.totals.resolved

    codeDetails.push({
      ...trig,
      description: TriggerMap.get(trig.code) ?? "Description unavailable",
      type: "trigger" as const
    })
  }

  return {
    codeDetails,
    date,
    totals: {
      resolved,
      totalLocked
    }
  }
}
