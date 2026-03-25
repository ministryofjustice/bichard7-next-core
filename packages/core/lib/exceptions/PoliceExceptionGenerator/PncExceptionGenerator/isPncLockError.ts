import type { PncException } from "@moj-bichard7/common/types/Exception"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import { getPncErrorCodeFromMessage } from "./generatePncExceptionFromMessage"

const isPncLockError = (pncException: PncException) =>
  pncException.code === ExceptionCode.HO100404 && getPncErrorCodeFromMessage(pncException.message) !== "PNCAM"

export default isPncLockError
