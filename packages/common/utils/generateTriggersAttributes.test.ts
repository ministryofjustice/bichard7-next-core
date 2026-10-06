import { generateTriggersAttributes } from "./generateTriggersAttributes"

describe("generateTriggersAttributes", () => {
  it("generates attributes for triggers with offence numbers", () => {
    const triggers = [
      { triggerCode: "TRPR0001", triggerItemIdentity: 1 },
      { triggerCode: "TRPR0002", triggerItemIdentity: 2 }
    ]

    const result = generateTriggersAttributes(triggers)

    expect(result).toEqual({ "Trigger 1 Details": "TRPR0001 (1)", "Trigger 2 Details": "TRPR0002 (2)" })
  })

  it("generates attributes for triggers without offence numbers", () => {
    const triggers = [
      { triggerCode: "TRPR0001", triggerItemIdentity: undefined },
      { triggerCode: "TRPR0002", triggerItemIdentity: undefined }
    ]

    const result = generateTriggersAttributes(triggers)

    expect(result).toEqual({ "Trigger 1 Details": "TRPR0001", "Trigger 2 Details": "TRPR0002" })
  })
})
