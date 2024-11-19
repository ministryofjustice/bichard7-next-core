import type { OrganisationUnitCodes } from "../types/AnnotatedHearingOutcome"

import areOrganisationUnitsEqual from "./areOrganisationUnitsEqual"

const emptyOrganisationUnit: OrganisationUnitCodes = {
  BottomLevelCode: "",
  OrganisationUnitCode: "",
  SecondLevelCode: "",
  ThirdLevelCode: "",
  TopLevelCode: ""
}

const nullOrganisationUnit: OrganisationUnitCodes = {
  BottomLevelCode: null,
  OrganisationUnitCode: null,
  SecondLevelCode: null,
  ThirdLevelCode: null,
  TopLevelCode: undefined
}

const nonEmptyOrganisationUnit: OrganisationUnitCodes = {
  BottomLevelCode: "00",
  OrganisationUnitCode: "C01HA00",
  SecondLevelCode: "01",
  ThirdLevelCode: "HA",
  TopLevelCode: "C"
}

const anotherNonEmptyOrganisationUnit: OrganisationUnitCodes = {
  BottomLevelCode: "00",
  OrganisationUnitCode: "01CJ00",
  SecondLevelCode: "01",
  ThirdLevelCode: "CJ",
  TopLevelCode: ""
}

describe("areOrganisationUnitsEqual", () => {
  const generateTestCases = (organisationUnit: OrganisationUnitCodes, expectedResult: boolean) => [
    { expectedResult, firstOrganisationUnit: organisationUnit, secondOrganisationUnit: undefined },
    { expectedResult, firstOrganisationUnit: organisationUnit, secondOrganisationUnit: null },
    { expectedResult, firstOrganisationUnit: organisationUnit, secondOrganisationUnit: {} as OrganisationUnitCodes },
    { expectedResult, firstOrganisationUnit: undefined, secondOrganisationUnit: organisationUnit },
    { expectedResult, firstOrganisationUnit: null, secondOrganisationUnit: organisationUnit },
    { expectedResult, firstOrganisationUnit: {} as OrganisationUnitCodes, secondOrganisationUnit: organisationUnit }
  ]

  it.each([
    { expectedResult: true, firstOrganisationUnit: undefined, secondOrganisationUnit: undefined },
    { expectedResult: true, firstOrganisationUnit: null, secondOrganisationUnit: null },
    { expectedResult: true, firstOrganisationUnit: null, secondOrganisationUnit: undefined },
    { expectedResult: true, firstOrganisationUnit: undefined, secondOrganisationUnit: null },
    { expectedResult: true, firstOrganisationUnit: undefined, secondOrganisationUnit: {} as OrganisationUnitCodes },
    { expectedResult: true, firstOrganisationUnit: null, secondOrganisationUnit: {} as OrganisationUnitCodes },
    { expectedResult: true, firstOrganisationUnit: {} as OrganisationUnitCodes, secondOrganisationUnit: undefined },
    { expectedResult: true, firstOrganisationUnit: {} as OrganisationUnitCodes, secondOrganisationUnit: null },
    {
      expectedResult: true,
      firstOrganisationUnit: emptyOrganisationUnit,
      secondOrganisationUnit: emptyOrganisationUnit
    },
    { expectedResult: true, firstOrganisationUnit: nullOrganisationUnit, secondOrganisationUnit: nullOrganisationUnit },
    {
      expectedResult: true,
      firstOrganisationUnit: nonEmptyOrganisationUnit,
      secondOrganisationUnit: nonEmptyOrganisationUnit
    },
    {
      expectedResult: false,
      firstOrganisationUnit: nonEmptyOrganisationUnit,
      secondOrganisationUnit: anotherNonEmptyOrganisationUnit
    },
    ...generateTestCases(emptyOrganisationUnit, true),
    ...generateTestCases(nullOrganisationUnit, true),
    ...generateTestCases(nonEmptyOrganisationUnit, false)
  ])(
    "returns $expectedResult when first next hearing location is $firstOrganisationUnit and second next hearing location is $secondOrganisationUnit",
    ({ expectedResult, firstOrganisationUnit, secondOrganisationUnit }) => {
      const result = areOrganisationUnitsEqual(firstOrganisationUnit, secondOrganisationUnit)

      expect(result).toBe(expectedResult)
    }
  )
})
