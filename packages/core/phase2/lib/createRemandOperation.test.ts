jest.mock("../../lib/isAdjournedNoNextHearing")
import isAdjournedNoNextHearing from "../../lib/isAdjournedNoNextHearing"
import type { Result } from "../../types/AnnotatedHearingOutcome"
import type { Operation } from "../../types/PncUpdateDataset"
import createRemandOperation from "./createRemandOperation"

const mockedIsAdjournedNoNextHearing = isAdjournedNoNextHearing as jest.Mock

describe("createRemandOperation", () => {
  beforeEach(() => {
    mockedIsAdjournedNoNextHearing.mockRestore()
  })

  it("should return a remand operation", () => {
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

    const { operations, exceptions } = createRemandOperation(result, "123")

    expect(operations).toHaveLength(1)
    expect(exceptions).toHaveLength(0)

    const remandOperation = operations[0] as Extract<Operation, { code: "NEWREM" }>
    expect(remandOperation.code).toBe("NEWREM")
    expect(remandOperation.status).toBe("NotAttempted")
    expect(remandOperation.data?.nextHearingDate?.toISOString()).toBe(result.NextHearingDate)
    expect(remandOperation.data?.nextHearingLocation).toEqual(result.NextResultSourceOrganisation)
    expect(remandOperation.data?.courtCaseReference).toBe("123")
  })

  it("should return a remand operation without a NextHearingDate", () => {
    const result = {
      NextResultSourceOrganisation: {
        TopLevelCode: "",
        SecondLevelCode: "",
        ThirdLevelCode: "",
        BottomLevelCode: "",
        OrganisationUnitCode: ""
      }
    } as Result

    const { operations, exceptions } = createRemandOperation(result, "123")

    expect(operations).toHaveLength(1)
    expect(exceptions).toHaveLength(0)

    const remandOperation = operations[0] as Extract<Operation, { code: "NEWREM" }>
    expect(remandOperation.code).toBe("NEWREM")
    expect(remandOperation.status).toBe("NotAttempted")
    expect(remandOperation.data?.nextHearingDate).toBeFalsy()
    expect(remandOperation.data?.nextHearingLocation).toEqual(result.NextResultSourceOrganisation)
    expect(remandOperation.data?.courtCaseReference).toBe("123")
  })

  it("should not return a remand operation if result is adjournment", () => {
    mockedIsAdjournedNoNextHearing.mockReturnValue(true)
    const result = {
      CJSresultCode: 0
    } as Result

    const { operations, exceptions } = createRemandOperation(result, undefined)

    expect(operations).toHaveLength(0)
    expect(exceptions).toHaveLength(0)
  })

  it("should return a remand operation with data if warrant has not been issued", () => {
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

    const { operations, exceptions } = createRemandOperation(result, undefined)

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: "NEWREM",
        status: "NotAttempted",
        data: {
          courtCaseReference: undefined,
          isAdjournmentPreJudgement: false,
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

  it("should return a remand operation without data if warrant has not been issued but NextResultSourceOrganisation is not set", () => {
    const result = {
      CJSresultCode: 4574,
      NextResultSourceOrganisation: undefined,
      NextHearingDate: "2024-05-03"
    } as Result

    const { operations, exceptions } = createRemandOperation(result, "123")

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: "NEWREM",
        status: "NotAttempted",
        data: undefined
      }
    ])
  })

  it.each([4576, 4577])(
    "should return a remand operation without data if warrant has been issued (%i result code)",
    (resultCode) => {
      const result = {
        CJSresultCode: resultCode,
        NextResultSourceOrganisation: {
          TopLevelCode: "1",
          SecondLevelCode: "02",
          ThirdLevelCode: "03",
          BottomLevelCode: "04",
          OrganisationUnitCode: "1020304"
        },
        NextHearingDate: "2024-05-03"
      } as Result

      const { operations, exceptions } = createRemandOperation(result, "123")

      expect(exceptions).toHaveLength(0)
      expect(operations).toStrictEqual([{ code: "NEWREM", data: undefined, status: "NotAttempted" }])
    }
  )
})
