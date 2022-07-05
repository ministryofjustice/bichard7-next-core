import { COMMON_LAWS } from "src/lib/offenceTypes"
import { LookupLocalOffenceCodeError, LookupNationalOffenceCodeError } from "src/types/LookupOffenceCodeError"
import { lookupLocalOffenceByCjsCode, lookupNationalOffenceByCjsCode } from "./lookupOffenceByCjsCode"

const localOffenceCode = "01CP001"
const areaCode = "01"

describe("lookupNationalOffenceByCjsCode()", () => {
  it("should return a national offence code from string without qualifier", () => {
    const result = lookupNationalOffenceByCjsCode(`${COMMON_LAWS}001`)
    expect(result).toMatchObject({
      cjsCode: "COML001",
      description: "COML001",
      homeOfficeClassification: "053/56",
      notifiableToHo: true,
      offenceCategory: "CI",
      offenceTitle: "Act with intent to prejudice / defraud HM Revenue and Customs",
      recordableOnPnc: true,
      resultHalfLifeHours: null
    })
  })

  it("should return a national offence code from string with qualifier", () => {
    const result = lookupNationalOffenceByCjsCode(`${COMMON_LAWS}001A`)
    expect(result).toMatchObject({
      cjsCode: "COML001",
      description: "COML001",
      homeOfficeClassification: "053/56",
      notifiableToHo: true,
      offenceCategory: "CI",
      offenceTitle: "Act with intent to prejudice / defraud HM Revenue and Customs",
      recordableOnPnc: true,
      resultHalfLifeHours: null
    })
  })

  it("should return a local offence code when there is no match from a full national lookup or a lookup without the qualifier", () => {
    const result = lookupNationalOffenceByCjsCode(`${areaCode}${localOffenceCode}`)
    expect(result).toMatchObject({
      cjsCode: "0101CP001",
      description: "0101CP001",
      homeOfficeClassification: "000/00",
      notifiableToHo: false,
      offenceCategory: "B7",
      offenceTitle:
        "Fail to comply with the European provisions on cosmetic products by making available cosmetic products which contained a",
      recordableOnPnc: false,
      resultHalfLifeHours: null
    })
  })

  it("should return an error when a national offence code is not found with a qualifier", () => {
    const result = lookupNationalOffenceByCjsCode(`${COMMON_LAWS}111A`)
    expect(result).toBeInstanceOf(LookupNationalOffenceCodeError)
  })

  it("should return an error when a national offence code is not found without a qualifier", () => {
    const result = lookupNationalOffenceByCjsCode(`${COMMON_LAWS}111`)
    expect(result).toBeInstanceOf(LookupNationalOffenceCodeError)
  })

  it("should return an error when a national or local offence code is not found", () => {
    const result = lookupNationalOffenceByCjsCode(`${COMMON_LAWS}111A`, "01")
    expect(result).toBeInstanceOf(LookupLocalOffenceCodeError)
  })
})

describe("lookupLocalOffenceByCjsCode()", () => {
  it("should return a local offence code", () => {
    const result = lookupLocalOffenceByCjsCode(localOffenceCode, areaCode)
    expect(result).toMatchObject({
      cjsCode: "0101CP001",
      description: "0101CP001",
      homeOfficeClassification: "000/00",
      notifiableToHo: false,
      offenceCategory: "B7",
      offenceTitle:
        "Fail to comply with the European provisions on cosmetic products by making available cosmetic products which contained a",
      recordableOnPnc: false,
      resultHalfLifeHours: null
    })
  })

  it("should return an error when a local offence code is not found", () => {
    const result = lookupLocalOffenceByCjsCode(localOffenceCode, "XX")
    expect(result).toBeInstanceOf(LookupLocalOffenceCodeError)
  })
})
