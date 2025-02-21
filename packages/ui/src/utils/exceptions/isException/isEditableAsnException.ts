import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { Exception } from "types/exceptions"

// specifically not an ASN exception, but enables ASN editable field
const editableAsnExceptions = [ExceptionCode.HO100300, ExceptionCode.HO100314]

export const isEditableAsnException = (exceptions: Exception[]): boolean =>
  exceptions.some((e) => editableAsnExceptions.includes(e.code))
