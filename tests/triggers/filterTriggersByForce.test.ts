import type { Trigger } from "../../src/types/Trigger"
import filterTriggersByForce from "../../src/triggers/filterTriggersByForce"
import { TriggerCode } from "../../src/types/TriggerCode"
import type ForceTriggerConfig from "../../src/types/ForceTriggerConfig"

const forceTriggerConfig: ForceTriggerConfig = {
  "02": {
    excludedTriggers: ["TRPR0005"]
  },
  "91": {
    excludedTriggers: ["TRPR0001"]
  },
  B01DU: {
    excludedTriggers: ["TRPR0005"]
  }
}

describe("Filter triggers by force", () => {
  it("should return all triggers if none are excluded", () => {
    const inputTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0001
      }
    ]

    const expectedTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0001
      }
    ]

    const resultTriggers = filterTriggersByForce("01", inputTriggers, forceTriggerConfig)

    expect(resultTriggers).toStrictEqual(expectedTriggers)
  })

  it("should exclude triggers that are configured", () => {
    const inputTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0001
      },
      {
        code: TriggerCode.TRPR0005
      }
    ]

    const expectedTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0001
      }
    ]

    const resultTriggers = filterTriggersByForce("02", inputTriggers, forceTriggerConfig)

    expect(resultTriggers).toStrictEqual(expectedTriggers)
  })
})
