import type { PncException } from "@moj-bichard7/common/types/Exception"

import type PoliceExceptionGenerator from "../../../../phase3/types/PoliceExceptionGenerator"

import generatePncEnquiryExceptionFromMessage from "./generatePncEnquiryExceptionFromMessage"
import generatePncUpdateExceptionFromMessage from "./generatePncUpdateExceptionFromMessage"
import isPncLockError from "./isPncLockError"
import isPncNotFoundError from "./isPncNotFoundError"

export default class PncExceptionGenerator implements PoliceExceptionGenerator {
  generateFromEnquiryMessage(message: string) {
    return generatePncEnquiryExceptionFromMessage(message)
  }

  generateFromUpdateMessage(message: string) {
    return generatePncUpdateExceptionFromMessage(message)
  }

  isLockError(code: PncException) {
    return isPncLockError(code)
  }

  isNotFoundError(message: string) {
    return isPncNotFoundError(message)
  }
}
