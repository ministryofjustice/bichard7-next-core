import type { Trigger } from "../../phase1/types/Trigger"
import { TriggerCode } from "../../types/TriggerCode"
import combineTriggerLists from "./combineTriggerLists"

describe("combineTriggerLists", () => {
  it("should return empty array when there are no pre and post update triggers", () => {
    const result = combineTriggerLists([], [])
    expect(result).toStrictEqual([])
  })

  it("should return pre update triggers when there are pre update triggers and no post update triggers", () => {
    const preUpdateTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0001,
        offenceSequenceNumber: 1
      },
      {
        code: TriggerCode.TRPR0005
      }
    ]
    const result = combineTriggerLists(preUpdateTriggers, [])
    expect(result).toStrictEqual(preUpdateTriggers)
  })

  it("should return post update triggers when there are post update triggers and no pre update triggers", () => {
    const postUpdateTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0007,
        offenceSequenceNumber: 2
      },
      {
        code: TriggerCode.TRPR0005
      }
    ]
    const result = combineTriggerLists([], postUpdateTriggers)
    expect(result).toStrictEqual(postUpdateTriggers)
  })

  it("should return post and pre update triggers when they are both available", () => {
    const preUpdateTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0001,
        offenceSequenceNumber: 1
      },
      {
        code: TriggerCode.TRPR0005
      }
    ]
    const postUpdateTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0007,
        offenceSequenceNumber: 2
      },
      {
        code: TriggerCode.TRPR0005
      }
    ]
    const result = combineTriggerLists(preUpdateTriggers, postUpdateTriggers)

    expect(result).toStrictEqual(preUpdateTriggers.concat(postUpdateTriggers))
  })

  it("should only add TRPR0027 once when both pre and post update triggers contain TRPR0027", () => {
    const preUpdateTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0027,
        offenceSequenceNumber: 1
      },
      {
        code: TriggerCode.TRPR0005
      }
    ]
    const postUpdateTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0027,
        offenceSequenceNumber: 2
      },
      {
        code: TriggerCode.TRPR0005
      },
      {
        code: TriggerCode.TRPR0008
      }
    ]
    const result = combineTriggerLists(preUpdateTriggers, postUpdateTriggers)

    expect(result).toStrictEqual([
      {
        code: TriggerCode.TRPR0027,
        offenceSequenceNumber: 1
      },
      {
        code: TriggerCode.TRPR0005
      },
      {
        code: TriggerCode.TRPR0005
      },
      {
        code: TriggerCode.TRPR0008
      }
    ])
  })

  it("should add TRPR0027 when pre update triggers contains TRPR0027", () => {
    const preUpdateTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0027,
        offenceSequenceNumber: 1
      },
      {
        code: TriggerCode.TRPR0005
      }
    ]
    const postUpdateTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0005
      },
      {
        code: TriggerCode.TRPR0008
      }
    ]
    const result = combineTriggerLists(preUpdateTriggers, postUpdateTriggers)

    expect(result).toStrictEqual(preUpdateTriggers.concat(postUpdateTriggers))
  })

  it("should add TRPR0027 when post update triggers contains TRPR0027", () => {
    const preUpdateTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0007,
        offenceSequenceNumber: 1
      },
      {
        code: TriggerCode.TRPR0005
      }
    ]
    const postUpdateTriggers: Trigger[] = [
      {
        code: TriggerCode.TRPR0027
      },
      {
        code: TriggerCode.TRPR0008
      }
    ]
    const result = combineTriggerLists(preUpdateTriggers, postUpdateTriggers)

    expect(result).toStrictEqual(preUpdateTriggers.concat(postUpdateTriggers))
  })
})
