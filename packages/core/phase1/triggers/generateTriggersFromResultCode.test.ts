import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import isCaseRecordable from "../lib/isCaseRecordable"
import TriggerRecordable from "../types/TriggerRecordable"
import generateTriggersFromResultCode from "./generateTriggersFromResultCode"
jest.mock("../lib/isCaseRecordable")

const mockedIsCaseRecordable = isCaseRecordable as jest.Mock

describe("generateTriggersFromResultCode", () => {
  it("should throw an exception if result code is undefined", () => {
    const generatedHearingOutcome = generateAhoFromOffenceList([] as Offence[])

    const fn = () => {
      generateTriggersFromResultCode(generatedHearingOutcome, {
        triggerCode: TriggerCode.TRPR0004,
        resultCodesForTrigger: undefined,
        triggerRecordable: TriggerRecordable.Yes,
        caseLevelTrigger: false
      })
    }

    expect(fn).toThrow("resultCodesForTrigger is undefined")
  })

  it("should not return a trigger if the hearing outcome is not recordable and the trigger is recordable", () => {
    mockedIsCaseRecordable.mockReturnValue(false)
    const generatedHearingOutcome = generateAhoFromOffenceList([] as Offence[])

    const result = generateTriggersFromResultCode(generatedHearingOutcome, {
      triggerCode: TriggerCode.TRPR0004,
      resultCodesForTrigger: [1234],
      triggerRecordable: TriggerRecordable.Yes,
      caseLevelTrigger: false
    })

    expect(result).toEqual([])
  })

  it("should not return a trigger if the hearing outcome is recordable and the trigger is not recordable", () => {
    mockedIsCaseRecordable.mockReturnValue(true)
    const generatedHearingOutcome = generateAhoFromOffenceList([] as Offence[])

    const result = generateTriggersFromResultCode(generatedHearingOutcome, {
      triggerCode: TriggerCode.TRPR0004,
      resultCodesForTrigger: [1234],
      triggerRecordable: TriggerRecordable.No,
      caseLevelTrigger: false
    })

    expect(result).toEqual([])
  })

  it("should return a trigger if an offence with a matching result code when the hearing outcome is recordable and the trigger is recordable", () => {
    mockedIsCaseRecordable.mockReturnValue(true)
    const generatedHearingOutcome = generateAhoFromOffenceList([
      {
        Result: [{ CJSresultCode: 1234 }],
        CourtOffenceSequenceNumber: 1
      } as Offence
    ])

    const result = generateTriggersFromResultCode(generatedHearingOutcome, {
      triggerCode: TriggerCode.TRPR0004,
      resultCodesForTrigger: [1234],
      triggerRecordable: TriggerRecordable.Yes,
      caseLevelTrigger: false
    })

    expect(result).toEqual([{ code: TriggerCode.TRPR0004, offenceSequenceNumber: 1 }])
  })
})
