jest.mock("../../phase1/lib/result/isAdjournedNoNextHearing")
import isAdjournedNoNextHearing from "../../phase1/lib/result/isAdjournedNoNextHearing"
import type { Result } from "../../types/AnnotatedHearingOutcome"
import type { Operation } from "../../types/PncUpdateDataset"
import addRemandOperation from "./addRemandOperation"
const mockedIsAdjournedNoNextHearing = isAdjournedNoNextHearing as jest.Mock

describe("addRemandOperation", () => {
  beforeEach(() => {
    mockedIsAdjournedNoNextHearing.mockRestore()
  })

  it("adds a remand operation to operations array", () => {
    const operations: Operation[] = []
    const result = {
      NextResultSourceOrganisation: {
        TopLevelCode: "",
        SecondLevelCode: "",
        ThirdLevelCode: "",
        BottomLevelCode: "",
        OrganisationUnitCode: ""
      },
      NextHearingDate: new Date().toISOString()
    } as Result

    addRemandOperation(result, operations)

    expect(operations).toHaveLength(1)

    const remandOperation = operations[0] as Extract<Operation, { code: "NEWREM" }>
    expect(remandOperation.code).toBe("NEWREM")
    expect(remandOperation.status).toBe("NotAttempted")
    expect(remandOperation.data?.nextHearingDate?.toISOString()).toBe(result.NextHearingDate)
    expect(remandOperation.data?.nextHearingLocation).toEqual(result.NextResultSourceOrganisation)
  })

  it("adds a remand operation without a NextHearingDate", () => {
    const operations: Operation[] = []
    const result = {
      NextResultSourceOrganisation: {
        TopLevelCode: "",
        SecondLevelCode: "",
        ThirdLevelCode: "",
        BottomLevelCode: "",
        OrganisationUnitCode: ""
      }
    } as Result

    addRemandOperation(result, operations)

    expect(operations).toHaveLength(1)

    const remandOperation = operations[0] as Extract<Operation, { code: "NEWREM" }>
    expect(remandOperation.code).toBe("NEWREM")
    expect(remandOperation.status).toBe("NotAttempted")
    expect(remandOperation.data?.nextHearingDate).toBeFalsy()
    expect(remandOperation.data?.nextHearingLocation).toEqual(result.NextResultSourceOrganisation)
  })

  it("does not add a remand operation if result is adjournment", () => {
    mockedIsAdjournedNoNextHearing.mockReturnValue(true)
    const operations: Operation[] = []
    const result = {
      CJSresultCode: 0
    } as Result

    addRemandOperation(result, operations)

    expect(operations).toHaveLength(0)
  })

  it("does add a remand operation with data if warrent has not been issued", () => {
    const operations: Operation[] = []
    const result = {
      CJSresultCode: 4574,
      NextResultSourceOrganisation: {
        TopLevelCode: "1",
        SecondLevelCode: "02",
        ThirdLevelCode: "03",
        BottomLevelCode: "04",
        OrganisationUnitCode: "1020304"
      },
      NextHearingDate: "2024-05-03"
    } as Result

    addRemandOperation(result, operations)

    expect(operations).toStrictEqual([
      {
        code: "NEWREM",
        status: "NotAttempted",
        data: {
          nextHearingLocation: {
            TopLevelCode: "1",
            SecondLevelCode: "02",
            ThirdLevelCode: "03",
            BottomLevelCode: "04",
            OrganisationUnitCode: "1020304"
          },
          nextHearingDate: new Date("2024-05-03T00:00:00.000Z")
        }
      }
    ])
  })

  it("does add a remand operation without data if warrent has not been issued but NextResultSourceOrganisation is not set", () => {
    const operations: Operation[] = []
    const result = {
      CJSresultCode: 4574,
      NextResultSourceOrganisation: undefined,
      NextHearingDate: "2024-05-03"
    } as Result

    addRemandOperation(result, operations)

    expect(operations).toStrictEqual([
      {
        code: "NEWREM",
        status: "NotAttempted",
        data: undefined
      }
    ])
  })

  it("does add a remand operation without data if warrent has been issued", () => {
    const operations: Operation[] = []
    const result = {
      CJSresultCode: 4576,
      NextResultSourceOrganisation: {
        TopLevelCode: "1",
        SecondLevelCode: "02",
        ThirdLevelCode: "03",
        BottomLevelCode: "04",
        OrganisationUnitCode: "1020304"
      },
      NextHearingDate: "2024-05-03"
    } as Result

    addRemandOperation(result, operations)

    expect(operations).toStrictEqual([{ code: "NEWREM", data: undefined, status: "NotAttempted" }])
  })
})
