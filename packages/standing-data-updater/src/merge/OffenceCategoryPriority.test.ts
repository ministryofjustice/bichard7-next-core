import type { OffenceCodeLookup } from "../types/OffenceCodeLookup"
import { OffenceCategoryPriority } from "./OffenceCategoryPriority"

const cjsCode = "ABC123"

const currentOffences: OffenceCodeLookup = { [cjsCode]: { cjsCode, offenceCategory: "CURRENT" } }
const pnldOffences: OffenceCodeLookup = { [cjsCode]: { cjsCode, offenceCategory: "PNLD" } }
const cjsOffences: OffenceCodeLookup = { [cjsCode]: { cjsCode, offenceCategory: "CJS" } }
const pncOffences: OffenceCodeLookup = { [cjsCode]: { cjsCode, offenceCategory: "PNC" } }

describe("OffenceCodeCategoryPriority", () => {
  it("should prioritise B7 overrides first", () => {
    const b7Overrides = [cjsCode]

    const priority = new OffenceCategoryPriority(currentOffences, cjsOffences, b7Overrides, pnldOffences, pncOffences)

    expect(priority.getHighestPriority(cjsCode)).toBe("B7")
  })

  it("should prioritise PNLD offences first", () => {
    const priority = new OffenceCategoryPriority(currentOffences, cjsOffences, [], pnldOffences, pncOffences)

    expect(priority.getHighestPriority(cjsCode)).toBe("PNLD")
  })

  it("should prioritise CJS offences second", () => {
    const priority = new OffenceCategoryPriority(currentOffences, cjsOffences, [], {}, pncOffences)

    expect(priority.getHighestPriority(cjsCode)).toBe("CJS")
  })

  it("should prioritise PNC offences third", () => {
    const priority = new OffenceCategoryPriority(currentOffences, {}, [], {}, pncOffences)

    expect(priority.getHighestPriority(cjsCode)).toBe("PNC")
  })

  it("should call back to current data", () => {
    const priority = new OffenceCategoryPriority(currentOffences, {}, [], {}, {})

    expect(priority.getHighestPriority(cjsCode)).toBe("CURRENT")
  })

  it("should return default category if not found", () => {
    const priority = new OffenceCategoryPriority({}, {}, [], {}, {})

    expect(priority.getHighestPriority(cjsCode)).toBe("CE")
  })
})
