import type { DisposalDurationUnit } from "../../../../types/leds/DisposalRequest"

const unitMap: Record<string, DisposalDurationUnit> = {
  d: "days",
  h: "hours",
  m: "months",
  w: "weeks",
  y: "years"
} as const

export const parseDisposalDuration = (disposalQuantity: string) => {
  const quantity = disposalQuantity.toLowerCase()
  const durationCode = quantity.slice(0, 1).trim()
  const countString = quantity.slice(1, 4).trim()

  let count: number = 0
  let units: DisposalDurationUnit

  if (quantity.startsWith("y999")) {
    count = 1
    units = "life"
  } else {
    count = Number(countString) || 0
    units = unitMap[durationCode] ?? ""
  }

  return { units, count }
}
