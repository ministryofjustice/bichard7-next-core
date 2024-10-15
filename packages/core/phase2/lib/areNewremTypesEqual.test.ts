import type { Operation } from "../../types/PncUpdateDataset"
import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import areRemandOperationsEqual from "./areRemandOperationsEqual"
import type { PncOperation } from "../../types/PncOperation"

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

describe("areRemandTypesEqual", () => {
  const generateTestCases = (organisationUnit: OrganisationUnitCodes, expectedResult: boolean) => [
    { firstData: organisationUnit, secondData: undefined, expectedResult },
    { firstData: organisationUnit, secondData: null, expectedResult },
    { firstData: organisationUnit, secondData: {}, expectedResult },
    { firstData: undefined, secondData: organisationUnit, expectedResult },
    { firstData: null, secondData: organisationUnit, expectedResult },
    { firstData: {}, secondData: organisationUnit, expectedResult }
  ]

  it.each([
    { firstData: undefined, secondData: undefined, expectedResult: true },
    { firstData: null, secondData: null, expectedResult: true },
    { firstData: null, secondData: undefined, expectedResult: true },
    { firstData: undefined, secondData: null, expectedResult: true },
    { firstData: undefined, secondData: {}, expectedResult: true },
    { firstData: null, secondData: {}, expectedResult: true },
    { firstData: {}, secondData: undefined, expectedResult: true },
    { firstData: {}, secondData: null, expectedResult: true },
    { firstData: emptyOrganisationUnit, secondData: emptyOrganisationUnit, expectedResult: true },
    { firstData: nullOrganisationUnit, secondData: nullOrganisationUnit, expectedResult: true },
    { firstData: nonEmptyOrganisationUnit, secondData: nonEmptyOrganisationUnit, expectedResult: true },
    { firstData: nonEmptyOrganisationUnit, secondData: anotherNonEmptyOrganisationUnit, expectedResult: false },
    ...generateTestCases(emptyOrganisationUnit, true),
    ...generateTestCases(nullOrganisationUnit, true),
    ...generateTestCases(nonEmptyOrganisationUnit, false)
  ])(
    "returns $expectedResult when first next hearing location is $firstData and second next hearing location is $secondData",
    ({ firstData, secondData, expectedResult }) => {
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
    { firstDate: undefined, secondDate: undefined, expectedResult: true },
    { firstDate: undefined, secondDate: new Date("2024-05-28"), expectedResult: false },
    { firstDate: new Date("2024-05-28"), secondDate: undefined, expectedResult: false },
    { firstDate: new Date("2024-05-29"), secondDate: new Date("2024-05-28"), expectedResult: false },
    { firstDate: new Date("2024-05-28"), secondDate: new Date("2024-05-28"), expectedResult: true }
  ])(
    "returns $expectedResult when first next hearing date is $firstDate and second next hearing date is $secondDate",
    ({ firstDate, secondDate, expectedResult }) => {
      const firstRemandOperation = { data: { nextHearingDate: firstDate } } as unknown as Operation<PncOperation.REMAND>
      const secondRemandOperation = {
        data: { nextHearingDate: secondDate }
      } as unknown as Operation<PncOperation.REMAND>

      const result = areRemandOperationsEqual(firstRemandOperation, secondRemandOperation)

      expect(result).toBe(expectedResult)
    }
  )
})
