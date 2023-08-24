import type { Trigger } from "../../phase1/types/Trigger"
import { TriggerCode } from "../../types/TriggerCode"
import generateTriggersNoteText, { TriggerCreationType } from "./generateTriggersNoteText"

const mockTriggers: Trigger[] = [
  {
    code: TriggerCode.TRPR0001,
    offenceSequenceNumber: 1
  },
  {
    code: TriggerCode.TRPR0002
  }
]

describe("generateTriggersNoteText", () => {
  it("should generate the triggers note text for created triggers by default", () => {
    const noteText = generateTriggersNoteText(mockTriggers)
    expect(noteText).toBe("Trigger codes: 1 x TRPR0001, 1 x TRPR0002.")
  })

  it("should generate the triggers note text for added triggers", () => {
    const noteText = generateTriggersNoteText(mockTriggers, TriggerCreationType.ADD)
    expect(noteText).toBe("Triggers added: 1 x TRPR0001, 1 x TRPR0002.")
  })

  it("should generate the triggers note text for deleted triggers", () => {
    const noteText = generateTriggersNoteText(mockTriggers, TriggerCreationType.DELETE)
    expect(noteText).toBe("Triggers deleted: 1 x TRPR0001, 1 x TRPR0002.")
  })

  it("should return null if the triggers array was empty", () => {
    const noteText = generateTriggersNoteText([], TriggerCreationType.DELETE)
    expect(noteText).toBeNull()
  })
})
