import type { Result } from "../../../types/AnnotatedHearingOutcome"

import { PncOperation } from "../../../types/PncOperation"
import createRemandOperation from "./createRemandOperation"

describe("createRemandOperation", () => {
  it("should return a remand operation", () => {
    const result = {
      NextHearingDate: new Date().toISOString(),
      NextResultSourceOrganisation: {
        BottomLevelCode: "",
        OrganisationUnitCode: "",
        SecondLevelCode: "",
        ThirdLevelCode: "",
        TopLevelCode: ""
      }
    } as Result

    const remandOperation = createRemandOperation(result, "123")

    expect(remandOperation.code).toBe(PncOperation.REMAND)
    expect(remandOperation.status).toBe("NotAttempted")
    expect(remandOperation.data?.nextHearingDate?.toISOString()).toBe(result.NextHearingDate)
    expect(remandOperation.data?.nextHearingLocation).toEqual(result.NextResultSourceOrganisation)
    expect(remandOperation.courtCaseReference).toBe("123")
  })

  it("should return a remand operation without a NextHearingDate", () => {
    const result = {
      NextResultSourceOrganisation: {
        BottomLevelCode: "",
        OrganisationUnitCode: "",
        SecondLevelCode: "",
        ThirdLevelCode: "",
        TopLevelCode: ""
      }
    } as Result

    const remandOperation = createRemandOperation(result, "123")

    expect(remandOperation.code).toBe(PncOperation.REMAND)
    expect(remandOperation.status).toBe("NotAttempted")
    expect(remandOperation.data?.nextHearingDate).toBeFalsy()
    expect(remandOperation.data?.nextHearingLocation).toEqual(result.NextResultSourceOrganisation)
    expect(remandOperation.courtCaseReference).toBe("123")
  })

  it("should return a remand operation with data if warrant has not been issued", () => {
    const result = {
      CJSresultCode: 4574,
      NextHearingDate: "2024-05-03",
      NextResultSourceOrganisation: {
        BottomLevelCode: "04",
        OrganisationUnitCode: "1020304",
        SecondLevelCode: "02",
        ThirdLevelCode: "03",
        TopLevelCode: "1"
      }
    } as Result

    const remandOperation = createRemandOperation(result, undefined)

    expect(remandOperation).toStrictEqual({
      code: PncOperation.REMAND,
      courtCaseReference: undefined,
      data: {
        nextHearingDate: new Date("2024-05-03T00:00:00.000Z"),
        nextHearingLocation: {
          BottomLevelCode: "04",
          OrganisationUnitCode: "1020304",
          SecondLevelCode: "02",
          ThirdLevelCode: "03",
          TopLevelCode: "1"
        }
      },
      isAdjournmentPreJudgement: false,
      status: "NotAttempted"
    })
  })

  it("should return a remand operation without data if warrant has not been issued but NextResultSourceOrganisation is not set", () => {
    const result = {
      CJSresultCode: 4574,
      NextHearingDate: "2024-05-03",
      NextResultSourceOrganisation: undefined
    } as Result

    const remandOperation = createRemandOperation(result, "123")

    expect(remandOperation).toStrictEqual({
      code: PncOperation.REMAND,
      courtCaseReference: "123",
      data: undefined,
      isAdjournmentPreJudgement: false,
      status: "NotAttempted"
    })
  })

  it.each([4576, 4577])(
    "should return a remand operation without data if warrant has been issued (%i result code)",
    (resultCode) => {
      const result = {
        CJSresultCode: resultCode,
        NextHearingDate: "2024-05-03",
        NextResultSourceOrganisation: {
          BottomLevelCode: "04",
          OrganisationUnitCode: "1020304",
          SecondLevelCode: "02",
          ThirdLevelCode: "03",
          TopLevelCode: "1"
        }
      } as Result

      const remandOperation = createRemandOperation(result, "123")

      expect(remandOperation).toStrictEqual({
        code: PncOperation.REMAND,
        courtCaseReference: "123",
        data: undefined,
        isAdjournmentPreJudgement: false,
        status: "NotAttempted"
      })
    }
  )
})
