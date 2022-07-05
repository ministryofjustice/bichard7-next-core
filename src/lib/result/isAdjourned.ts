const adjournmentRanges = [
  [4001, 4009],
  [4011, 4017],
  [4020, 4021],
  [4023, 4025],
  [4027, 4035],
  [4046, 4048],
  [4050, 4050],
  [4051, 4051],
  [4053, 4058],
  [4506, 4506],
  [4508, 4508],
  [4541, 4572],
  [4574, 4574],
  [4587, 4589]
]

const isAdjourned = (cjsResultCode?: number) =>
  cjsResultCode && adjournmentRanges.some((range) => cjsResultCode >= range[0] && cjsResultCode <= range[1])

export default isAdjourned
