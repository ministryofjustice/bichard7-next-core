import type { DisposalDurationUnit } from "../../../../types/leds/DisposalRequest"

type ParseDisposalDurationResult = undefined | { count: number; units: DisposalDurationUnit }

const unitMap: Record<string, DisposalDurationUnit> = {
  d: "days",
  h: "hours",
  m: "months",
  w: "weeks",
  y: "years"
} as const

export const parseDisposalDuration = (disposalQuantity: string): ParseDisposalDurationResult => {
  const quantity = disposalQuantity.toLowerCase()
  const durationCode = quantity.slice(0, 1).trim()
  const countString = quantity.slice(1, 4).trim()

  let count: number = 0
  let units: DisposalDurationUnit

  if (quantity.startsWith("y999")) {
    count = 0
    units = "life"
  } else {
    count = Number(countString) || 0
    units = unitMap[durationCode] ?? ""

    if (!count) {
      return undefined
    }
  }

  if (!units) {
    return undefined
  }

  return { units, count }
}
