import type { OffenceCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import type { LookupNationalOffenceCodeError, LookupLocalOffenceCodeError } from "src/types/LookupOffenceCodeError"

const isOffenceCode = (
  result: OffenceCode | LookupNationalOffenceCodeError | LookupLocalOffenceCodeError
): result is OffenceCode => (result as OffenceCode).cjsCode !== undefined

export default isOffenceCode
