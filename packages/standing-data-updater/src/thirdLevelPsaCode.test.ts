import organisationUnits from "../output-data/data/organisation-unit.json"

const organisationUnitsWithNonEmptyThirdLevelPsaCode = organisationUnits.filter((ou) => ou.thirdLevelPsaCode !== "")

test.each(organisationUnitsWithNonEmptyThirdLevelPsaCode)(
  "Third-level PSA code '$thirdLevelPsaCode' can be converted to number",
  (organisationUnit) => {
    const thirdLevelPsaCode = Number.parseInt(organisationUnit.thirdLevelPsaCode, 10)

    expect(Number.isNaN(thirdLevelPsaCode)).toBe(false)
  }
)
