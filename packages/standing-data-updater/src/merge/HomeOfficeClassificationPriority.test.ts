import type { OffenceCodeLookup } from "../types/OffenceCodeLookup"
import HomeOfficeClassifictionPriority from "./HomeOfficeClassificationPriority"

const cjsCode = "ABC123"
const homeOfficeClassification = "123/45"

describe("NotifiableToHOPriority", () => {
  it("should prioritise PNLD offences above current offence codes", () => {
    const pnldOffences: OffenceCodeLookup = { [cjsCode]: { cjsCode, homeOfficeClassification } }

    const currentOffences: OffenceCodeLookup = {
      [cjsCode]: { cjsCode, homeOfficeClassification: "CURRENT" }
    }

    const priority = new HomeOfficeClassifictionPriority(currentOffences, pnldOffences)

    expect(priority.getHighestPriority(cjsCode)).toEqual(homeOfficeClassification)
  })

  it("should fall back to current offences", () => {
    const currentOffences: OffenceCodeLookup = { [cjsCode]: { cjsCode, homeOfficeClassification } }

    const priority = new HomeOfficeClassifictionPriority(currentOffences, {})

    expect(priority.getHighestPriority(cjsCode)).toEqual(homeOfficeClassification)
  })

  it("should return default value if not found", () => {
    const priority = new HomeOfficeClassifictionPriority({}, {})

    expect(priority.getHighestPriority(cjsCode)).toBe("000/00")
  })
})
