import type { OffenceCodeLookup } from "../types/OffenceCodeLookup"
import OffenceTitlePriority from "./OffenceTitlePriority"

const cjsCode = "ABC123"

const currentOffences: OffenceCodeLookup = { [cjsCode]: { cjsCode, offenceTitle: "CURRENT" } }
const pnldOffences: OffenceCodeLookup = { [cjsCode]: { cjsCode, offenceTitle: "PNLD" } }
const cjsOffences: OffenceCodeLookup = { [cjsCode]: { cjsCode, offenceTitle: "CJS" } }
const pncOffences: OffenceCodeLookup = { [cjsCode]: { cjsCode, offenceTitle: "PNC" } }

describe("OffenceTitlePriority", () => {
  it("should prioritise PNLD offences first", () => {
    const priority = new OffenceTitlePriority(currentOffences, pnldOffences, cjsOffences, pncOffences)

    expect(priority.getHighestPriority(cjsCode)).toBe("PNLD")
  })

  it("should prioritise CJS offences second", () => {
    const priority = new OffenceTitlePriority(currentOffences, {}, cjsOffences, pncOffences)

    expect(priority.getHighestPriority(cjsCode)).toBe("CJS")
  })

  it("should prioritise PNC offences third", () => {
    const priority = new OffenceTitlePriority(currentOffences, {}, {}, pncOffences)

    expect(priority.getHighestPriority(cjsCode)).toBe("PNC")
  })

  it("should fall back to curent offences", () => {
    const priority = new OffenceTitlePriority(currentOffences, {}, {}, {})

    expect(priority.getHighestPriority(cjsCode)).toBe("CURRENT")
  })

  it("should return default title if not found", () => {
    const priority = new OffenceTitlePriority({}, {}, {}, {})

    expect(priority.getHighestPriority(cjsCode)).toBe("")
  })
})
