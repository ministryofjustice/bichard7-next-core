import type { PncException } from "@moj-bichard7/common/types/Exception"

import type PoliceExceptionGenerator from "../../../../phase3/types/PoliceExceptionGenerator"

import generateLedsEnquiryExceptionFromMessage from "./generateLedsEnquiryExceptionFromMessage"
import generateLedsUpdateExceptionFromMessage from "./generateLedsUpdateExceptionFromMessage"
import isLedsNotFoundError from "./isLedsNotFoundError"

export default class LedsExceptionGenerator implements PoliceExceptionGenerator {
  generateFromEnquiryMessage(message: string) {
    return generateLedsEnquiryExceptionFromMessage(message)
  }

  generateFromUpdateMessage(message: string) {
    return generateLedsUpdateExceptionFromMessage(message)
  }

  isLockError(_code: PncException) {
    return false
  }

  isNotFoundError(message: string) {
    return isLedsNotFoundError(message)
  }
}
