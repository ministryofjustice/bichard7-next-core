import type { OffenceCode } from "../types/OffenceCode"
import type { OffenceCodeLookup } from "../types/OffenceCodeLookup"

const createOffenceCodeLookup = (offenceCodes: OffenceCode[]): OffenceCodeLookup =>
  offenceCodes.reduce((acc: OffenceCodeLookup, o) => {
    acc[o.cjsCode.trim()] = o
    return acc
  }, {})

export default createOffenceCodeLookup
