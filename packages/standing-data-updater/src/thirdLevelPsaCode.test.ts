import { organisationUnit } from "@moj-bichard7/standing-data"

const organisationUnitsWithNonEmptyThirdLevelPsaCode = organisationUnit.filter((ou) => ou.thirdLevelPsaCode !== "")

test.each(organisationUnitsWithNonEmptyThirdLevelPsaCode)(
  "Third-level PSA code '$thirdLevelPsaCode' can be converted to number",
  (organisationUnit) => {
    const thirdLevelPsaCode = Number.parseInt(organisationUnit.thirdLevelPsaCode, 10)

    expect(Number.isNaN(thirdLevelPsaCode)).toBe(false)
  }
)
