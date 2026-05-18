import type { CodeDetailDto, UserPerformanceDetailDto } from "@moj-bichard7/common/types/reports/UserPerformanceDetail"

import type { UserDetailJsonRow } from "../../../types/reports/UserDetail"

import ExceptionMap from "../../data/getExceptionDescriptionMap"
import TriggerMap from "../../data/getTriggerDescriptionMap"

export const mapToUserPerformanceDetailDtoDay = (date: Date, row?: UserDetailJsonRow): UserPerformanceDetailDto => {
  if (!row) {
    return {
      codeDetails: [] as CodeDetailDto[],
      date
    }
  }

  return {
    codeDetails: [
      ...row.exceptions.map((exc) => ({
        ...exc,
        description: ExceptionMap.get(exc.code) ?? "Description unavailable",
        type: "exception" as const,
        users: exc.users.map((user) => ({
          ...user,
          fullName: user.fullName ?? user.username
        }))
      })),
      ...row.triggers.map((trig) => ({
        ...trig,
        description: TriggerMap.get(trig.code) ?? "Description unavailable",
        type: "trigger" as const,
        users: trig.users.map((user) => ({
          ...user,
          fullName: user.fullName ?? user.username
        }))
      }))
    ],
    date
  }
}
