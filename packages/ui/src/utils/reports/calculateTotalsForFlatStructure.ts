import type { TotalColumnConfig } from "types/reports/Config"

export const calculateTotalsForFlatStructure = <TRow>(
  rows: TRow[],
  totalsConfig?: TotalColumnConfig[],
  calculateTotalsCallback?: (totals: Record<string, number>, rows: TRow[]) => void
): Record<string, number> | undefined => {
  if (!totalsConfig || totalsConfig.length === 0) {
    return undefined
  }

  const totals = Object.fromEntries(totalsConfig.map(({ key }) => [key, 0]))

  if (calculateTotalsCallback) {
    calculateTotalsCallback(totals, rows)
  }

  return totals
}
