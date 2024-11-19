import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import type { PncOperation } from "../../types/PncOperation"
import type { Operation } from "../../types/PncUpdateDataset"

import areRemandOperationsEqual from "./areRemandOperationsEqual"

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

describe("areRemandOperationsEqual", () => {
  const generateTestCases = (organisationUnit: OrganisationUnitCodes, expectedResult: boolean) => [
    { expectedResult, firstData: organisationUnit, secondData: undefined },
    { expectedResult, firstData: organisationUnit, secondData: null },
    { expectedResult, firstData: organisationUnit, secondData: {} },
    { expectedResult, firstData: undefined, secondData: organisationUnit },
    { expectedResult, firstData: null, secondData: organisationUnit },
    { expectedResult, firstData: {}, secondData: organisationUnit }
  ]

  it.each([
    { expectedResult: true, firstData: undefined, secondData: undefined },
    { expectedResult: true, firstData: null, secondData: null },
    { expectedResult: true, firstData: null, secondData: undefined },
    { expectedResult: true, firstData: undefined, secondData: null },
    { expectedResult: true, firstData: undefined, secondData: {} },
    { expectedResult: true, firstData: null, secondData: {} },
    { expectedResult: true, firstData: {}, secondData: undefined },
    { expectedResult: true, firstData: {}, secondData: null },
    { expectedResult: true, firstData: emptyOrganisationUnit, secondData: emptyOrganisationUnit },
    { expectedResult: true, firstData: nullOrganisationUnit, secondData: nullOrganisationUnit },
    { expectedResult: true, firstData: nonEmptyOrganisationUnit, secondData: nonEmptyOrganisationUnit },
    { expectedResult: false, firstData: nonEmptyOrganisationUnit, secondData: anotherNonEmptyOrganisationUnit },
    ...generateTestCases(emptyOrganisationUnit, true),
    ...generateTestCases(nullOrganisationUnit, true),
    ...generateTestCases(nonEmptyOrganisationUnit, false)
  ])(
    "returns $expectedResult when first next hearing location is $firstData and second next hearing location is $secondData",
    ({ expectedResult, firstData, secondData }) => {
      const firstRemandOperation = {
        data: { nextHearingLocation: firstData }
      } as unknown as Operation<PncOperation.REMAND>
      const secondRemandOperation = {
        data: { nextHearingLocation: secondData }
      } as unknown as Operation<PncOperation.REMAND>

      const result = areRemandOperationsEqual(firstRemandOperation, secondRemandOperation)

      expect(result).toBe(expectedResult)
    }
  )

  it.each([
    { expectedResult: true, firstDate: undefined, secondDate: undefined },
    { expectedResult: false, firstDate: undefined, secondDate: new Date("2024-05-28") },
    { expectedResult: false, firstDate: new Date("2024-05-28"), secondDate: undefined },
    { expectedResult: false, firstDate: new Date("2024-05-29"), secondDate: new Date("2024-05-28") },
    { expectedResult: true, firstDate: new Date("2024-05-28"), secondDate: new Date("2024-05-28") }
  ])(
    "returns $expectedResult when first next hearing date is $firstDate and second next hearing date is $secondDate",
    ({ expectedResult, firstDate, secondDate }) => {
      const firstRemandOperation = { data: { nextHearingDate: firstDate } } as unknown as Operation<PncOperation.REMAND>
      const secondRemandOperation = {
        data: { nextHearingDate: secondDate }
      } as unknown as Operation<PncOperation.REMAND>

      const result = areRemandOperationsEqual(firstRemandOperation, secondRemandOperation)

      expect(result).toBe(expectedResult)
    }
  )
})
