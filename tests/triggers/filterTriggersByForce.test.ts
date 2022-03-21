import type { Trigger } from "../../src/types/Trigger"
import filterTriggersByForce from "../../src/triggers/filterTriggersByForce"
import { TriggerCode } from "../../src/types/TriggerCode"
import type { OrganisationUnit } from "../../src/types/AnnotatedHearingOutcome"

const generateForce = (force: string): OrganisationUnit => ({
  SecondLevelCode: force,
  ThirdLevelCode: "",
  BottomLevelCode: "",
  OrganisationUnitCode: "0000000"
})

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

    const resultTriggers = filterTriggersByForce(generateForce("01"), inputTriggers)

    expect(resultTriggers).toStrictEqual(expectedTriggers)
  })

  //   it("should exclude triggers that are configured", () => {
  //     // const inputTriggers: Trigger[] = [
  //     //   {
  //     //     code: TriggerCode.TRPR0001
  //     //   }
  //     // ]
  //     // const expectedTriggers: Trigger[] = [
  //     //   {
  //     //     code: TriggerCode.TRPR0001
  //     //   }
  //     // ]
  //     // const aho = {}
  //     // const resultTriggers = filterTriggersByForce(aho, inputTriggers)
  //     // expect(resultTriggers).toBe(expectedTriggers)
  //   })
})
