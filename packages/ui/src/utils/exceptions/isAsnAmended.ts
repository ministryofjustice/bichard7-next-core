import type { Amendments } from "types/Amendments"
import type { Exception } from "types/exceptions"
import isAsnFormatValid from "./isAsnFormatValid"
import isAsnException from "./isException/isAsnException"
import { isEditableAsnException } from "./isException/isEditableAsnException"

const isAsnAmended = (exceptions: Exception[], asn: Amendments["asn"]) => {
  const asnCannotBeAmended = !isAsnException(exceptions) && !isEditableAsnException(exceptions)
  if (asnCannotBeAmended) {
    return false
  }

  return isAsnFormatValid(asn ?? "")
}

export default isAsnAmended
