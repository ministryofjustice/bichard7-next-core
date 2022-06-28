import { WARRANT_ISSUED_CODES } from "./properties"

const isWarrantIssued = (cjsResultCode?: number) =>
  cjsResultCode && WARRANT_ISSUED_CODES.some((range) => cjsResultCode >= range[0] && cjsResultCode <= range[1])

export default isWarrantIssued
