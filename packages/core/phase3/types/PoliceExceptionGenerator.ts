import type { PncException } from "@moj-bichard7/common/types/Exception"

interface PoliceExceptionGenerator {
  generateFromEnquiryMessage: (message: string) => PncException
  generateFromUpdateMessage: (message: string) => PncException
  isLockError: (code: PncException) => boolean
  isNotFoundError: (message: string) => boolean
}

export default PoliceExceptionGenerator
