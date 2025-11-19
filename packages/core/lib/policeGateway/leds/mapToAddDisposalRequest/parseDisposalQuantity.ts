import type { DisposalDurationUnit } from "../../../../types/leds/DisposalRequest"

export const parseDisposalQuantity = (disposalQuantity: string) => {
  const quantity = disposalQuantity.toLowerCase()
  const durationCode = quantity.slice(0, 1).trim()
  const day = quantity.slice(4, 6).trim()
  const month = quantity.slice(6, 8).trim()
  const year = quantity.slice(8, 12).trim()
  const amount = Number(quantity.slice(12)) || 0
  const disposalEffectiveDate = year && month && day ? `${year}-${month}-${day}` : undefined

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

  return { count, units, disposalEffectiveDate, amount }
}
