import type { User } from "@moj-bichard7/common/types/User"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"
import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { every } from "lodash"

export const reasonFilterOnlyIncludesTriggers = (reason: Reason): boolean => reason === Reason.Triggers

export const reasonFilterOnlyIncludesExceptions = (reason: Reason): boolean => reason === Reason.Exceptions

export const reasonCodesAreExceptionsOnly = (reasonCodes: string[]): boolean => {
  if (reasonCodes?.length === 0) {
    return false
  }

  return every(reasonCodes, (rc: string) => ExceptionCode[rc as keyof typeof ExceptionCode])
}

export const reasonCodesAreTriggersOnly = (reasonCodes: string[]): boolean => {
  if (reasonCodes?.length === 0) {
    return false
  }

  return every(reasonCodes, (rc: string) => TriggerCode[rc as keyof typeof TriggerCode])
}

export const shouldFilterForExceptions = (user: User, reason: Reason): boolean =>
  (userAccess(user)[Permission.Exceptions] && !userAccess(user)[Permission.Triggers]) ||
  (userAccess(user)[Permission.Exceptions] && reasonFilterOnlyIncludesExceptions(reason))

export const shouldFilterForTriggers = (user: User, reason: Reason): boolean =>
  (userAccess(user)[Permission.Triggers] && !userAccess(user)[Permission.Exceptions]) ||
  (userAccess(user)[Permission.Triggers] && reasonFilterOnlyIncludesTriggers(reason))

export const canSeeTriggersAndException = (user: User, reason: Reason): boolean =>
  userAccess(user)[Permission.Exceptions] && userAccess(user)[Permission.Triggers] && reason === Reason.All
