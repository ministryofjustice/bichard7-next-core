import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { Offence } from "../../types/AnnotatedHearingOutcome"

import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import TriggerRecordable from "../../types/TriggerRecordable"
import isCaseRecordable from "../isCaseRecordable"
import generateTriggersFromResultCode from "./generateTriggersFromResultCode"
jest.mock("../isCaseRecordable")

const mockedIsCaseRecordable = isCaseRecordable as jest.Mock

describe("generateTriggersFromResultCode", () => {
  it("should throw an exception if result code is undefined", () => {
    const generatedHearingOutcome = generateAhoFromOffenceList([] as Offence[])

    const fn = () => {
      generateTriggersFromResultCode(generatedHearingOutcome, {
        caseLevelTrigger: false,
        resultCodesForTrigger: undefined,
        triggerCode: TriggerCode.TRPR0004,
        triggerRecordable: TriggerRecordable.Yes
      })
    }

    expect(fn).toThrow("resultCodesForTrigger is undefined")
  })

  it("should not return a trigger if the hearing outcome is not recordable and the trigger is recordable", () => {
    mockedIsCaseRecordable.mockReturnValue(false)
    const generatedHearingOutcome = generateAhoFromOffenceList([] as Offence[])

    const result = generateTriggersFromResultCode(generatedHearingOutcome, {
      caseLevelTrigger: false,
      resultCodesForTrigger: [1234],
      triggerCode: TriggerCode.TRPR0004,
      triggerRecordable: TriggerRecordable.Yes
    })

    expect(result).toEqual([])
  })

  it("should not return a trigger if the hearing outcome is recordable and the trigger is not recordable", () => {
    mockedIsCaseRecordable.mockReturnValue(true)
    const generatedHearingOutcome = generateAhoFromOffenceList([] as Offence[])

    const result = generateTriggersFromResultCode(generatedHearingOutcome, {
      caseLevelTrigger: false,
      resultCodesForTrigger: [1234],
      triggerCode: TriggerCode.TRPR0004,
      triggerRecordable: TriggerRecordable.No
    })

    expect(result).toEqual([])
  })

  it("should return a trigger if an offence with a matching result code when the hearing outcome is recordable and the trigger is recordable", () => {
    mockedIsCaseRecordable.mockReturnValue(true)
    const generatedHearingOutcome = generateAhoFromOffenceList([
      {
        CourtOffenceSequenceNumber: 1,
        Result: [{ CJSresultCode: 1234 }]
      } as Offence
    ])

    const result = generateTriggersFromResultCode(generatedHearingOutcome, {
      caseLevelTrigger: false,
      resultCodesForTrigger: [1234],
      triggerCode: TriggerCode.TRPR0004,
      triggerRecordable: TriggerRecordable.Yes
    })

    expect(result).toEqual([{ code: TriggerCode.TRPR0004, offenceSequenceNumber: 1 }])
  })

  it("should return a trigger if an offence with a matching result code when the hearing outcome is not recordable and the trigger is not recordable", () => {
    mockedIsCaseRecordable.mockReturnValue(false)
    const generatedHearingOutcome = generateAhoFromOffenceList([
      {
        CourtOffenceSequenceNumber: 1,
        Result: [{ CJSresultCode: 1234 }]
      } as Offence
    ])

    const result = generateTriggersFromResultCode(generatedHearingOutcome, {
      caseLevelTrigger: false,
      resultCodesForTrigger: [1234],
      triggerCode: TriggerCode.TRPR0004,
      triggerRecordable: TriggerRecordable.No
    })

    expect(result).toEqual([{ code: TriggerCode.TRPR0004, offenceSequenceNumber: 1 }])
  })

  it("should not return a trigger for an offence without a matching result code regardless of recordablity", () => {
    mockedIsCaseRecordable.mockReturnValue(true)
    const generatedHearingOutcome = generateAhoFromOffenceList([
      {
        CourtOffenceSequenceNumber: 1,
        Result: [{ CJSresultCode: 1234 }]
      } as Offence
    ])

    const result = generateTriggersFromResultCode(generatedHearingOutcome, {
      caseLevelTrigger: false,
      resultCodesForTrigger: [9999],
      triggerCode: TriggerCode.TRPR0004,
      triggerRecordable: TriggerRecordable.Both
    })

    expect(result).toEqual([])
  })

  it("should return a case level trigger if the caseLevelTrigger flag is set", () => {
    mockedIsCaseRecordable.mockReturnValue(true)
    const generatedHearingOutcome = generateAhoFromOffenceList([
      {
        CourtOffenceSequenceNumber: 1,
        Result: [{ CJSresultCode: 1234 }]
      } as Offence
    ])

    const result = generateTriggersFromResultCode(generatedHearingOutcome, {
      caseLevelTrigger: true,
      resultCodesForTrigger: [1234],
      triggerCode: TriggerCode.TRPR0004,
      triggerRecordable: TriggerRecordable.Yes
    })

    expect(result).toEqual([{ code: TriggerCode.TRPR0004 }])
  })

  it("should not return a case level trigger if the caseLevelTrigger flag is set and there are no triggers", () => {
    mockedIsCaseRecordable.mockReturnValue(true)
    const generatedHearingOutcome = generateAhoFromOffenceList([
      {
        CourtOffenceSequenceNumber: 1,
        Result: [{ CJSresultCode: 1234 }]
      } as Offence
    ])

    const result = generateTriggersFromResultCode(generatedHearingOutcome, {
      caseLevelTrigger: true,
      resultCodesForTrigger: [9999],
      triggerCode: TriggerCode.TRPR0004,
      triggerRecordable: TriggerRecordable.Both
    })

    expect(result).toEqual([])
  })
})
