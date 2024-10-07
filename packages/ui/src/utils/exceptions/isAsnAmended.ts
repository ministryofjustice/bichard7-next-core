import { Amendments } from "types/Amendments"
import { Exception } from "types/exceptions"
import isAsnFormatValid from "./isAsnFormatValid"
import isAsnException from "./isException/isAsnException"

const isAsnAmended = (exceptions: Exception[], asn: Amendments["asn"]) => {
  const hasAsnException = isAsnException(exceptions)
  if (!hasAsnException) {
    return false
  }

  return isAsnFormatValid(asn ?? "")
}

export default isAsnAmended
