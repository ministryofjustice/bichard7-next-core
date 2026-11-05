import type { OffenceCodeLookup } from "../types/OffenceCodeLookup"
import NotifiableToHOPriority from "./NotifiableToHOPriority"

const cjsCode = "ABC123"
const notifiableToHo = true

describe("NotifiableToHOPriority", () => {
  it("should prioritise PNLD offences above current offence codes", () => {
    const pnldOffences: OffenceCodeLookup = { [cjsCode]: { cjsCode, notifiableToHo } }

    const currentOffences: OffenceCodeLookup = {
      [cjsCode]: { cjsCode, notifiableToHo: false }
    }

    const priority = new NotifiableToHOPriority(currentOffences, pnldOffences)

    expect(priority.getHighestPriority(cjsCode)).toEqual(notifiableToHo)
  })

  it("should fall back to current offences", () => {
    const currentOffences: OffenceCodeLookup = { [cjsCode]: { cjsCode, notifiableToHo } }

    const priority = new NotifiableToHOPriority(currentOffences, {})

    expect(priority.getHighestPriority(cjsCode)).toEqual(notifiableToHo)
  })

  it("should return default value if not found", () => {
    const priority = new NotifiableToHOPriority({}, {})

    expect(priority.getHighestPriority(cjsCode)).toBe(false)
  })
})
