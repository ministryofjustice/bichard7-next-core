import type { OrganisationUnitCodes } from "../types/AnnotatedHearingOutcome"

import areOrganisationUnitsEqual from "./areOrganisationUnitsEqual"

const emptyOrganisationUnit: OrganisationUnitCodes = {
  TopLevelCode: "",
  SecondLevelCode: "",
  ThirdLevelCode: "",
  BottomLevelCode: "",
  OrganisationUnitCode: ""
}

const nullOrganisationUnit: OrganisationUnitCodes = {
  TopLevelCode: undefined,
  SecondLevelCode: null,
  ThirdLevelCode: null,
  BottomLevelCode: null,
  OrganisationUnitCode: null
}

const nonEmptyOrganisationUnit: OrganisationUnitCodes = {
  TopLevelCode: "C",
  SecondLevelCode: "01",
  ThirdLevelCode: "HA",
  BottomLevelCode: "00",
  OrganisationUnitCode: "C01HA00"
}

const anotherNonEmptyOrganisationUnit: OrganisationUnitCodes = {
  TopLevelCode: "",
  SecondLevelCode: "01",
  ThirdLevelCode: "CJ",
  BottomLevelCode: "00",
  OrganisationUnitCode: "01CJ00"
}

describe("areOrganisationUnitsEqual", () => {
  const generateTestCases = (organisationUnit: OrganisationUnitCodes, expectedResult: boolean) => [
    { firstOrganisationUnit: organisationUnit, secondOrganisationUnit: undefined, expectedResult },
    { firstOrganisationUnit: organisationUnit, secondOrganisationUnit: null, expectedResult },
    { firstOrganisationUnit: organisationUnit, secondOrganisationUnit: {} as OrganisationUnitCodes, expectedResult },
    { firstOrganisationUnit: undefined, secondOrganisationUnit: organisationUnit, expectedResult },
    { firstOrganisationUnit: null, secondOrganisationUnit: organisationUnit, expectedResult },
    { firstOrganisationUnit: {} as OrganisationUnitCodes, secondOrganisationUnit: organisationUnit, expectedResult }
  ]

  it.each([
    { firstOrganisationUnit: undefined, secondOrganisationUnit: undefined, expectedResult: true },
    { firstOrganisationUnit: null, secondOrganisationUnit: null, expectedResult: true },
    { firstOrganisationUnit: null, secondOrganisationUnit: undefined, expectedResult: true },
    { firstOrganisationUnit: undefined, secondOrganisationUnit: null, expectedResult: true },
    { firstOrganisationUnit: undefined, secondOrganisationUnit: {} as OrganisationUnitCodes, expectedResult: true },
    { firstOrganisationUnit: null, secondOrganisationUnit: {} as OrganisationUnitCodes, expectedResult: true },
    { firstOrganisationUnit: {} as OrganisationUnitCodes, secondOrganisationUnit: undefined, expectedResult: true },
    { firstOrganisationUnit: {} as OrganisationUnitCodes, secondOrganisationUnit: null, expectedResult: true },
    {
      firstOrganisationUnit: emptyOrganisationUnit,
      secondOrganisationUnit: emptyOrganisationUnit,
      expectedResult: true
    },
    { firstOrganisationUnit: nullOrganisationUnit, secondOrganisationUnit: nullOrganisationUnit, expectedResult: true },
    {
      firstOrganisationUnit: nonEmptyOrganisationUnit,
      secondOrganisationUnit: nonEmptyOrganisationUnit,
      expectedResult: true
    },
    {
      firstOrganisationUnit: nonEmptyOrganisationUnit,
      secondOrganisationUnit: anotherNonEmptyOrganisationUnit,
      expectedResult: false
    },
    ...generateTestCases(emptyOrganisationUnit, true),
    ...generateTestCases(nullOrganisationUnit, true),
    ...generateTestCases(nonEmptyOrganisationUnit, false)
  ])(
    "returns $expectedResult when first next hearing location is $firstOrganisationUnit and second next hearing location is $secondOrganisationUnit",
    ({ firstOrganisationUnit, secondOrganisationUnit, expectedResult }) => {
      const result = areOrganisationUnitsEqual(firstOrganisationUnit, secondOrganisationUnit)

      expect(result).toBe(expectedResult)
    }
  )
})
