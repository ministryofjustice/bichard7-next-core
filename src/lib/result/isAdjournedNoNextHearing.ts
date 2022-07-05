import { ADJOURNMENT_NO_NEXT_HEARING_RANGES } from "src/lib/properties"

const isAdjournedNoNextHearing = (cjsResultCode?: number) =>
  cjsResultCode &&
  ADJOURNMENT_NO_NEXT_HEARING_RANGES.some((range) => cjsResultCode >= range[0] && cjsResultCode <= range[1])

export default isAdjournedNoNextHearing
