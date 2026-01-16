import { parseDisposalDuration } from "./parseDisposalDuration"

export const parseDisposalQuantity = (disposalQuantity: string) => {
  const quantity = disposalQuantity.toLowerCase()
  const day = quantity.slice(4, 6).trim()
  const month = quantity.slice(6, 8).trim()
  const year = quantity.slice(8, 12).trim()
  const amount = Number(quantity.slice(12)) || 0
  const disposalEffectiveDate = year && month && day ? `${year}-${month}-${day}` : undefined
  const { units, count } = parseDisposalDuration(quantity)

  return { count, units, disposalEffectiveDate, amount }
}
