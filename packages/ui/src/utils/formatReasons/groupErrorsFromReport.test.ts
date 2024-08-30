import groupErrorsFromReport from "./groupErrorsFromReport"

describe("groupErrorsFromReport", () => {
  it("can map all exceptions from the error report", () => {
    const errorReport = "HO100322||ds:OrganisationUnitCode, HO100323||ds:NextHearingDate HO100310||ds:NextHearingDate"
    expect(groupErrorsFromReport(errorReport)).toStrictEqual({ HO100322: 1, HO100323: 1, HO100310: 1 })
  })

  it("can group multiple occurrences of a code", () => {
    const errorReport = "HO100322||ds:OrganisationUnitCode, HO100322||ds:NextHearingDate HO100310||ds:NextHearingDate"
    expect(groupErrorsFromReport(errorReport)).toStrictEqual({ HO100322: 2, HO100310: 1 })
  })
})
