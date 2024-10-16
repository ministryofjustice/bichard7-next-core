import { OUT_OF_AREA_TRIGGER_CODE, REALLOCATE_CASE_TRIGGER_CODE } from "../../../src/config"
import recalculateTriggers from "../../../src/services/reallocateCourtCase/recalculateTriggers"
import type { default as TriggerEntity } from "../../../src/services/entities/Trigger"
import type { Trigger } from "@moj-bichard7-developers/bichard7-next-core/core/types/Trigger"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import type { ResolutionStatus } from "../../../src/types/ResolutionStatus"

describe("recalculateTriggers", () => {
  const dummyId = 0

  const getCaseTrigger = (code: TriggerCode, status: ResolutionStatus, triggerItemIdentity?: number): TriggerEntity => {
    return {
      triggerId: dummyId,
      triggerItemIdentity,
      triggerCode: code,
      status: status
    } as Partial<TriggerEntity> as TriggerEntity
  }

  const getTrigger = (code: TriggerCode, offenceSequenceNumber?: number): Trigger => {
    return {
      offenceSequenceNumber,
      code: code
    } as Trigger
  }

  const testCases: {
    description: string
    existingTriggers: TriggerEntity[]
    newTriggers: Trigger[]
    expectedTriggerToAdd: Trigger[]
    expectedTriggersToDelete: Trigger[]
  }[] = [
    {
      description: "It deletes unresolved triggers when new triggers are empty",
      existingTriggers: [
        getCaseTrigger(TriggerCode.TRPR0001, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0002, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0003, "Resolved"),
        getCaseTrigger(TriggerCode.TRPR0004, "Submitted")
      ],
      newTriggers: [],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: [getTrigger(TriggerCode.TRPR0001), getTrigger(TriggerCode.TRPR0002)]
    },
    {
      description: "It deletes a trigger that is not in the new trigger list",
      existingTriggers: [
        getCaseTrigger(TriggerCode.TRPR0001, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0002, "Unresolved")
      ],
      newTriggers: [getTrigger(TriggerCode.TRPR0002)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: [getTrigger(TriggerCode.TRPR0001)]
    },
    {
      description: "It adds triggers that are in the new trigger list",
      existingTriggers: [getCaseTrigger(TriggerCode.TRPR0002, "Unresolved")],
      newTriggers: [getTrigger(TriggerCode.TRPR0002), getTrigger(TriggerCode.TRPR0003)],
      expectedTriggerToAdd: [getTrigger(TriggerCode.TRPR0003)],
      expectedTriggersToDelete: []
    },
    {
      description: "It adds a new reallocate trigger when the existing reallocate trigger is resolved",
      existingTriggers: [getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Resolved")],
      newTriggers: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It adds a reallocate trigger when there is a new reallocate trigger and there is no existing reallocate trigger",
      existingTriggers: [],
      newTriggers: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It does not add a new reallocate trigger when there is an unresolved reallocate trigger in both existing and new trigger list",
      existingTriggers: [getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved")],
      newTriggers: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It does not add a new reallocate trigger when the existing reallocate trigger is resolved, but there is another unresolved trigger",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Resolved"),
        getCaseTrigger(TriggerCode.TRPR0002, "Unresolved")
      ],
      newTriggers: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE), getTrigger(TriggerCode.TRPR0002)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It does not add reallocate trigger when the existing unresolved trigger is deleted " +
        "but there is a new trigger besides reallocate trigger",
      existingTriggers: [getCaseTrigger(TriggerCode.TRPR0001, "Unresolved")],
      newTriggers: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE), getTrigger(TriggerCode.TRPR0002)],
      expectedTriggerToAdd: [getTrigger(TriggerCode.TRPR0002)],
      expectedTriggersToDelete: [getTrigger(TriggerCode.TRPR0001)]
    },
    {
      description: "It does not delete the reallocate trigger when the new triggers are same as the existing triggers",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0001, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0002, "Unresolved")
      ],
      newTriggers: [
        getTrigger(REALLOCATE_CASE_TRIGGER_CODE),
        getTrigger(TriggerCode.TRPR0001),
        getTrigger(TriggerCode.TRPR0002)
      ],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description: "It does not delete an unresolved reallocate trigger when the case has a resolved trigger",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0001, "Resolved")
      ],
      newTriggers: [getTrigger(TriggerCode.TRPR0001)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description: "It does not delete an unresolved reallocate trigger when the case has multiple resolved triggers",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0001, "Resolved"),
        getCaseTrigger(TriggerCode.TRPR0002, "Resolved")
      ],
      newTriggers: [getTrigger(TriggerCode.TRPR0001), getTrigger(TriggerCode.TRPR0002)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description: "It does not delete an unresolved reallocate trigger when there are no other triggers",
      existingTriggers: [getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved")],
      newTriggers: [],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description: "It does not delete a resolved trigger and deletes the reallocate trigger if there is a new trigger",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0001, "Resolved", 1)
      ],
      newTriggers: [getTrigger(TriggerCode.TRPR0001, 2)],
      expectedTriggerToAdd: [getTrigger(TriggerCode.TRPR0001, 2)],
      expectedTriggersToDelete: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)]
    },
    {
      description:
        "It does not delete a resolved trigger and an unresolved reallocate trigger when there are no new triggers",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0001, "Resolved", 1)
      ],
      newTriggers: [],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It does not delete resolved triggers when there is a new trigger with different offence sequence number",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0001, "Resolved", 1)
      ],
      newTriggers: [getTrigger(TriggerCode.TRPR0001, 2)],
      expectedTriggerToAdd: [getTrigger(TriggerCode.TRPR0001, 2)],
      expectedTriggersToDelete: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)]
    },
    {
      description: "It deletes an unresolved reallocate trigger when the case has an unresolved trigger",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0001, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0002, "Resolved")
      ],
      newTriggers: [getTrigger(TriggerCode.TRPR0001), getTrigger(TriggerCode.TRPR0002)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)]
    },
    {
      description: "It deletes an unresolved reallocate trigger when the case has a new trigger",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0001, "Unresolved")
      ],
      newTriggers: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE), getTrigger(TriggerCode.TRPR0002)],
      expectedTriggerToAdd: [getTrigger(TriggerCode.TRPR0002)],
      expectedTriggersToDelete: [getTrigger(TriggerCode.TRPR0001), getTrigger(REALLOCATE_CASE_TRIGGER_CODE)]
    },
    {
      description:
        "It deletes a trigger when the offence sequence number is different on the new trigger " +
        "and adds the new trigger with the correct offence sequence number",
      existingTriggers: [getCaseTrigger(TriggerCode.TRPR0001, "Unresolved", 1)],
      newTriggers: [getTrigger(TriggerCode.TRPR0001, 2)],
      expectedTriggerToAdd: [getTrigger(TriggerCode.TRPR0001, 2)],
      expectedTriggersToDelete: [getTrigger(TriggerCode.TRPR0001, 1)]
    },
    {
      description: "It deletes the reallocate trigger when there are new triggers to add",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0001, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0002, "Unresolved")
      ],
      newTriggers: [
        getTrigger(REALLOCATE_CASE_TRIGGER_CODE),
        getTrigger(TriggerCode.TRPR0003),
        getTrigger(TriggerCode.TRPR0004)
      ],
      expectedTriggerToAdd: [getTrigger(TriggerCode.TRPR0003), getTrigger(TriggerCode.TRPR0004)],
      expectedTriggersToDelete: [
        getTrigger(TriggerCode.TRPR0001),
        getTrigger(TriggerCode.TRPR0002),
        getTrigger(REALLOCATE_CASE_TRIGGER_CODE)
      ]
    },
    {
      description: "It deletes all unresolved triggers there is a new trigger with different offence sequence number",
      existingTriggers: [
        getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved"),
        getCaseTrigger(TriggerCode.TRPR0001, "Unresolved", 1)
      ],
      newTriggers: [getTrigger(TriggerCode.TRPR0001, 2)],
      expectedTriggerToAdd: [getTrigger(TriggerCode.TRPR0001, 2)],
      expectedTriggersToDelete: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE), getTrigger(TriggerCode.TRPR0001, 1)]
    },
    {
      description:
        "It adds an out of area trigger when the existing out of area trigger is resolved " +
        "and new triggers include out of are trigger",
      existingTriggers: [getCaseTrigger(OUT_OF_AREA_TRIGGER_CODE, "Resolved")],
      newTriggers: [getTrigger(OUT_OF_AREA_TRIGGER_CODE)],
      expectedTriggerToAdd: [getTrigger(OUT_OF_AREA_TRIGGER_CODE)],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It adds a reallocate trigger but does not add an out of area trigger " +
        "when the new triggers include out of area trigger and reallocate trigger",
      existingTriggers: [],
      newTriggers: [getTrigger(OUT_OF_AREA_TRIGGER_CODE), getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggersToDelete: []
    },
    {
      description: "It adds a new out of area trigger when the current one is resolved",
      existingTriggers: [getCaseTrigger(OUT_OF_AREA_TRIGGER_CODE, "Resolved")],
      newTriggers: [getTrigger(OUT_OF_AREA_TRIGGER_CODE)],
      expectedTriggerToAdd: [getTrigger(OUT_OF_AREA_TRIGGER_CODE)],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It does not add an out of area trigger when the existing out of area trigger is unresolved " +
        "and new triggers include out of are trigger",
      existingTriggers: [getCaseTrigger(OUT_OF_AREA_TRIGGER_CODE, "Unresolved")],
      newTriggers: [getTrigger(OUT_OF_AREA_TRIGGER_CODE)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It does not add an out of area trigger when the new triggers include a reallocate" +
        "trigger and out of area trigger but there is an existing unresolved reallocate case trigger",
      existingTriggers: [getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved")],
      newTriggers: [getTrigger(OUT_OF_AREA_TRIGGER_CODE), getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It does not delete a resolved out of area trigger when the new triggers include a reallocate trigger and another trigger",
      existingTriggers: [getCaseTrigger(OUT_OF_AREA_TRIGGER_CODE, "Resolved")],
      newTriggers: [getTrigger(TriggerCode.TRPR0001), getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [getTrigger(TriggerCode.TRPR0001)],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It does not delete an existing resolved out of area trigger and adds reallocate trigger " +
        "when the new triggers include reallocate trigger and out of area trigger",
      existingTriggers: [getCaseTrigger(OUT_OF_AREA_TRIGGER_CODE, "Resolved")],
      newTriggers: [getTrigger(OUT_OF_AREA_TRIGGER_CODE), getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggersToDelete: []
    },
    {
      description:
        "It deletes an existing reallocate trigger and does not add out of area trigger " +
        "when the new triggers include out of area trigger and another trigger",
      existingTriggers: [getCaseTrigger(REALLOCATE_CASE_TRIGGER_CODE, "Unresolved")],
      newTriggers: [getTrigger(TriggerCode.TRPR0001), getTrigger(OUT_OF_AREA_TRIGGER_CODE)],
      expectedTriggerToAdd: [getTrigger(TriggerCode.TRPR0001)],
      expectedTriggersToDelete: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)]
    },
    {
      description:
        "It deletes an existing unresolved out of area trigger and adds reallocate trigger " +
        "when the new triggers include reallocate trigger and out of area trigger",
      existingTriggers: [getCaseTrigger(OUT_OF_AREA_TRIGGER_CODE, "Unresolved")],
      newTriggers: [getTrigger(OUT_OF_AREA_TRIGGER_CODE), getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggersToDelete: [getTrigger(OUT_OF_AREA_TRIGGER_CODE)]
    },
    {
      description:
        "It deletes an existing unresolved out of area trigger and adds reallocate trigger " +
        "when the new triggers include reallocate trigger and out of area trigger" +
        "and the existing triggers include both resolved and unresolved out of area triggers",
      existingTriggers: [
        getCaseTrigger(OUT_OF_AREA_TRIGGER_CODE, "Resolved"),
        getCaseTrigger(OUT_OF_AREA_TRIGGER_CODE, "Unresolved")
      ],
      newTriggers: [getTrigger(OUT_OF_AREA_TRIGGER_CODE), getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggersToDelete: [getTrigger(OUT_OF_AREA_TRIGGER_CODE)]
    },
    // This fails with the new logic but the legacy behavior seems like a bug
    // {
    //   description:
    //     "It deletes an existing unresolved out of area trigger when the new triggers include a reallocate trigger and another trigger",
    //   existingTriggers: [getCaseTrigger(OUT_OF_AREA_TRIGGER_CODE, "Unresolved")],
    //   newTriggers: [getTrigger(TriggerCode.TRPR0001), getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
    //   expectedTriggerToAdd: [getTrigger(TriggerCode.TRPR0001), getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
    //   expectedTriggersToDelete: [getTrigger(OUT_OF_AREA_TRIGGER_CODE), getTrigger(OUT_OF_AREA_TRIGGER_CODE)]
    // }

    // The new behavior:
    {
      description:
        "It deletes an existing unresolved out of area trigger when the new triggers include a reallocate trigger and another trigger",
      existingTriggers: [getCaseTrigger(OUT_OF_AREA_TRIGGER_CODE, "Unresolved")],
      newTriggers: [getTrigger(TriggerCode.TRPR0001), getTrigger(REALLOCATE_CASE_TRIGGER_CODE)],
      expectedTriggerToAdd: [getTrigger(TriggerCode.TRPR0001)],
      expectedTriggersToDelete: [getTrigger(OUT_OF_AREA_TRIGGER_CODE)]
    }
  ]

  test.each(testCases)(
    "$description",
    ({ existingTriggers, newTriggers, expectedTriggerToAdd, expectedTriggersToDelete }) => {
      const result = recalculateTriggers(existingTriggers, newTriggers)

      expect(result.triggersToAdd).toEqual(expectedTriggerToAdd)
      expect(result.triggersToDelete).toEqual(expectedTriggersToDelete)
    }
  )
})
