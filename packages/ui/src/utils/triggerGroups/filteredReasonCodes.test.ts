import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import getShortTriggerCode from "services/entities/transformers/getShortTriggerCode"
import type { ReasonCode } from "types/CourtCaseFilter"
import filteredReasonCodes from "./filteredReasonCodes"

const triggerCodes = [TriggerCode.TRPR0008, TriggerCode.TRPR0010]

describe("filteredReasonCodes", () => {
  it("will return empty array if no triggerCodes and no reason codes are given", () => {
    expect(filteredReasonCodes([], [])).toEqual([])
  })

  it("will return empty array if no reason codes are given", () => {
    expect(filteredReasonCodes(triggerCodes, [])).toEqual([])
  })

  describe("with long trigger codes", () => {
    it("will return empty array if reason codes are given and don't match any trigger code", () => {
      const reasonCodes = [{ value: TriggerCode.TRPR0001 }]

      expect(filteredReasonCodes(triggerCodes, reasonCodes)).toEqual([])
    })

    it("will return matching reason codes", () => {
      const reasonCodes: ReasonCode[] = [
        { value: TriggerCode.TRPR0001 },
        { value: TriggerCode.TRPR0008 },
        { value: TriggerCode.TRPR0010 }
      ]

      expect(filteredReasonCodes(triggerCodes, reasonCodes)).toEqual([
        { value: TriggerCode.TRPR0008 },
        { value: TriggerCode.TRPR0010 }
      ])
    })

    it("will check to see if the trigger code exists", () => {
      const reasonCodes = [{ value: "XXX00001" }]

      expect(filteredReasonCodes(triggerCodes, reasonCodes)).toEqual([])
    })
  })

  describe("with short trigger codes", () => {
    it("will return empty array if reason codes are given and don't match any trigger code", () => {
      const reasonCodes = [{ value: getShortTriggerCode(TriggerCode.TRPR0001) ?? "" }]

      expect(filteredReasonCodes(triggerCodes, reasonCodes)).toEqual([])
    })

    it("will return matching reason codes", () => {
      const reasonCodes: ReasonCode[] = [{ value: "PR01" }, { value: "PR08" }, { value: "PR10" }]

      expect(filteredReasonCodes(triggerCodes, reasonCodes)).toEqual([{ value: "PR08" }, { value: "PR10" }])
    })

    it("will check to see if the trigger code exists", () => {
      const reasonCodes = [{ value: "XX01" }]

      expect(filteredReasonCodes(triggerCodes, reasonCodes)).toEqual([])
    })
  })
})
