import type { CodeDetailDto, UserPerformanceDetailDto } from "@moj-bichard7/common/types/reports/UserPerformanceDetail"

import type { UserDetailJsonRow } from "../../../types/reports/UserDetail"

import ExceptionMap from "../../data/getExceptionDescriptionMap"
import TriggerMap from "../../data/getTriggerDescriptionMap"

export const mapToUserPerformanceDetailDtoDay = (date: Date, row?: UserDetailJsonRow): UserPerformanceDetailDto => {
  if (!row) {
    return {
      date,
      exceptions: [] as CodeDetailDto[],
      triggers: [] as CodeDetailDto[]
    }
  }

  return {
    date,
    exceptions: row.exceptions.map((exc) => ({
      ...exc,
      description: ExceptionMap.get(exc.code) || "Description unavailable"
    })),
    triggers: row.triggers.map((trig) => ({
      ...trig,
      description: TriggerMap.get(trig.code) || "Description unavailable"
    }))
  }
}
