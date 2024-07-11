import TriggerCode from "bichard7-next-data-latest/types/TriggerCode"
import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import TriggerRecordable from "../types/TriggerRecordable"
import generateTriggersFromResultCode from "./generateTriggersFromResultCode"

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
})
