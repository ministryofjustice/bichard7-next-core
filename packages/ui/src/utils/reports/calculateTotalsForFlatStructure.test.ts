import { calculateTotalsForFlatStructure } from "./calculateTotalsForFlatStructure" // Adjust the import path as needed
import type { TotalColumnConfig } from "types/reports/Config"

type TestRow = {
  id: number
  amount: number
  quantity: number
}

describe("calculateTotalsForFlatStructure", () => {
  const mockRows: TestRow[] = [
    { id: 1, amount: 100, quantity: 2 },
    { id: 2, amount: 250, quantity: 1 }
  ]

  const mockTotalsConfig: TotalColumnConfig[] = [
    { key: "totalAmount", label: "Total Amount" },
    { key: "totalQuantity", label: "Total Quantity" }
  ]

  it("should return undefined if totalsConfig is undefined", () => {
    const result = calculateTotalsForFlatStructure(mockRows, undefined)

    expect(result).toBeUndefined()
  })

  it("should return undefined if totalsConfig is an empty array", () => {
    const result = calculateTotalsForFlatStructure(mockRows, [])

    expect(result).toBeUndefined()
  })

  it("should initialize keys to 0 when totalsConfig is provided but no callback is given", () => {
    const result = calculateTotalsForFlatStructure(mockRows, mockTotalsConfig)

    expect(result).toEqual({
      totalAmount: 0,
      totalQuantity: 0
    })
  })

  it("should apply the calculateTotalsCallback and mutate the totals object correctly", () => {
    const mockCallback = jest.fn((totals: Record<string, number>, rows: TestRow[]) => {
      rows.forEach((row) => {
        totals.totalAmount += row.amount
        totals.totalQuantity += row.quantity
      })
    })

    const result = calculateTotalsForFlatStructure(mockRows, mockTotalsConfig, mockCallback)

    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith({ totalAmount: 350, totalQuantity: 3 }, mockRows)

    expect(result).toEqual({
      totalAmount: 350,
      totalQuantity: 3
    })
  })
})
