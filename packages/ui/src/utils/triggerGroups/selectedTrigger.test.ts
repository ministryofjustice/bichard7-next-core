import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { ReasonCode } from "types/CourtCaseFilter"
import selectedTrigger from "./selectedTrigger"

describe("selectedTrigger", () => {
  it("returns false when there's no reasonCodes", () => {
    const result = selectedTrigger(TriggerCode.TRPR0008, [])

    expect(result).toBe(false)
  })

  it("returns false when there's a reasonCodes and it doesn't match", () => {
    const reasonCodes: ReasonCode = { value: TriggerCode.TRPR0001 }
    const result = selectedTrigger(TriggerCode.TRPR0008, [reasonCodes])

    expect(result).toBe(false)
  })

  it("returns true when there's a reasonCodes and it does match", () => {
    const reasonCodes: ReasonCode = { value: TriggerCode.TRPR0008 }
    const result = selectedTrigger(TriggerCode.TRPR0008, [reasonCodes])

    expect(result).toBe(true)
  })

  it("returns true when there's a reasonCodes with a short trigger code and it does match", () => {
    const reasonCodes: ReasonCode = { value: "PR08" }
    const result = selectedTrigger(TriggerCode.TRPR0008, [reasonCodes])

    expect(result).toBe(true)
  })

  it("returns false when there's an array of reasonCodes and it does not match", () => {
    const reasonCodes: ReasonCode[] = [{ value: TriggerCode.TRPR0001 }, { value: TriggerCode.TRPR0002 }]
    const result = selectedTrigger(TriggerCode.TRPR0008, reasonCodes)

    expect(result).toBe(false)
  })

  it("returns true when there's an array of reasonCodes and it does match", () => {
    const reasonCodes: ReasonCode[] = [{ value: TriggerCode.TRPR0001 }, { value: TriggerCode.TRPR0008 }]
    const result = selectedTrigger(TriggerCode.TRPR0008, reasonCodes)

    expect(result).toBe(true)
  })
})
