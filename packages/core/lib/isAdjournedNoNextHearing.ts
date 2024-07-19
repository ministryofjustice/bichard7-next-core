const adjournmentNoNextHearingRanges = [[0, 0]]

const isAdjournedNoNextHearing = (cjsResultCode: number) =>
  cjsResultCode &&
  adjournmentNoNextHearingRanges.some((range) => cjsResultCode >= range[0] && cjsResultCode <= range[1])

export default isAdjournedNoNextHearing
