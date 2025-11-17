jest.mock("./createPoliceAdjudication")
import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { verdict } from "@moj-bichard7-developers/bichard7-next-data"

import createPoliceAdjudication from "./createPoliceAdjudication"
import createPoliceAdjudicationFromAho from "./createPoliceAdjudicationFromAho"

const mockedCreatePoliceAdjudication = (createPoliceAdjudication as jest.Mock).mockReturnValue({ dummy: "dummy" })

describe("createPoliceAdjudicationFromAho", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockedCreatePoliceAdjudication.mockReturnValue({ dummy: "dummy" })
  })

  it("should return an adjudication when NumberOfOffencesTIC, Verdict, PleaStatus are undefined", () => {
    const result = createPoliceAdjudicationFromAho([{ PNCDisposalType: 1000 } as Result], new Date("2024-05-10"))

    expect(result).toStrictEqual({ dummy: "dummy" })
    expect(mockedCreatePoliceAdjudication).toHaveBeenCalledWith(1000, "", "", new Date("2024-05-10"), 0)
  })

  it("should use the first recordable offence to create an adjudication and count number of offences TIC correctly", () => {
    const result = createPoliceAdjudicationFromAho(
      [
        { PNCDisposalType: 1000, NumberOfOffencesTIC: 2, Verdict: "NC", PleaStatus: "DEN" } as Result,
        { PNCDisposalType: 1001, NumberOfOffencesTIC: 3, Verdict: "G", PleaStatus: "CON" } as Result,
        { PNCDisposalType: 1002, NumberOfOffencesTIC: 4, Verdict: "G", PleaStatus: "ADM" } as Result
      ],
      new Date("2024-05-10")
    )

    expect(result).toStrictEqual({ dummy: "dummy" })
    expect(mockedCreatePoliceAdjudication).toHaveBeenCalledWith(1001, "CONSENTED", "GUILTY", new Date("2024-05-10"), 9)
  })

  it("should return an adjudication when NumberOfOffencesTIC, Verdict, PleaStatus have value", () => {
    const result = createPoliceAdjudicationFromAho(
      [{ PNCDisposalType: 1000, NumberOfOffencesTIC: 2, Verdict: "NC", PleaStatus: "DEN" } as Result],
      new Date("2024-05-10")
    )

    expect(result).toStrictEqual({ dummy: "dummy" })
    expect(mockedCreatePoliceAdjudication).toHaveBeenCalledWith(
      1000,
      "NOT GUILTY",
      "NON-CONVICTION",
      new Date("2024-05-10"),
      2
    )
  })

  it.each([undefined, "", "invalid and lookup fails", "NC"])(
    "should set verdict to GUILTY when plea is ADM and verdict is %s",
    (verdict) => {
      const result = createPoliceAdjudicationFromAho(
        [{ PNCDisposalType: 1000, NumberOfOffencesTIC: 2, Verdict: verdict, PleaStatus: "ADM" } as Result],
        new Date("2024-05-10")
      )

      expect(result).toStrictEqual({ dummy: "dummy" })
      expect(mockedCreatePoliceAdjudication).toHaveBeenCalledWith(1000, "GUILTY", "GUILTY", new Date("2024-05-10"), 2)
    }
  )

  it.each(verdict.filter((v) => v.cjsCode && v.cjsCode !== "NC"))(
    "should set verdict to $pncCode when verdict is $cjsCode",
    ({ cjsCode, pncCode }) => {
      const result = createPoliceAdjudicationFromAho(
        [{ PNCDisposalType: 1000, NumberOfOffencesTIC: 2, Verdict: cjsCode, PleaStatus: "ADM" } as Result],
        new Date("2024-05-10")
      )

      expect(result).toStrictEqual({ dummy: "dummy" })
      expect(mockedCreatePoliceAdjudication).toHaveBeenCalledWith(1000, "GUILTY", pncCode, new Date("2024-05-10"), 2)
    }
  )
})
