import { ADJOURNMENT_RANGES } from "./properties"

const isAdjourned = (cjsResultCode?: number) =>
  cjsResultCode && ADJOURNMENT_RANGES.some((range) => cjsResultCode >= range[0] && cjsResultCode <= range[1])

export default isAdjourned
