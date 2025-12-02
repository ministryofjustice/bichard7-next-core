import type { DisposalDurationUnit } from "../../../../types/leds/DisposalRequest"

export const parseDisposalDuration = (disposalQuantity: string) => {
  const quantity = disposalQuantity.toLowerCase().trim()
  const durationCode = quantity.slice(0, 1).trim()

  let count: number = 0
  let units: DisposalDurationUnit

  if (quantity.slice(0, 4) === "y999") {
    count = 1
    units = "life"
  } else {
    count = Number(quantity.slice(1, 4).trim()) || 0
    const unitMap: Record<string, DisposalDurationUnit> = {
      d: "days",
      h: "hours",
      m: "months",
      w: "weeks",
      y: "years"
    }
    units = unitMap[durationCode] ?? ""
  }

  return { units, count }
}
