jest.mock("./createPncAdjudication")
import { verdict } from "@moj-bichard7-developers/bichard7-next-data"

import type { Result } from "../../types/AnnotatedHearingOutcome"

import createPncAdjudication from "./createPncAdjudication"
import createPncAdjudicationFromAho from "./createPncAdjudicationFromAho"

const mockedCreatePncAdjudication = (createPncAdjudication as jest.Mock).mockReturnValue({ dummy: "dummy" })

describe("createPncAdjudicationFromAho", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockedCreatePncAdjudication.mockReturnValue({ dummy: "dummy" })
  })

  it("should return a PNC adjudication when NumberOfOffencesTIC, Verdict, PleaStatus are undefined", () => {
    const result = createPncAdjudicationFromAho([{ PNCDisposalType: 1000 } as Result], new Date("2024-05-10"))

    expect(result).toStrictEqual({ dummy: "dummy" })
    expect(mockedCreatePncAdjudication).toHaveBeenCalledWith(1000, "", "", new Date("2024-05-10"), 0)
  })

  it("should use the first recordable offence to create PNC ajdudication and count number of offences TIC correctly", () => {
    const result = createPncAdjudicationFromAho(
      [
        { NumberOfOffencesTIC: 2, PleaStatus: "DEN", PNCDisposalType: 1000, Verdict: "NC" } as Result,
        { NumberOfOffencesTIC: 3, PleaStatus: "CON", PNCDisposalType: 1001, Verdict: "G" } as Result,
        { NumberOfOffencesTIC: 4, PleaStatus: "ADM", PNCDisposalType: 1002, Verdict: "G" } as Result
      ],
      new Date("2024-05-10")
    )

    expect(result).toStrictEqual({ dummy: "dummy" })
    expect(mockedCreatePncAdjudication).toHaveBeenCalledWith(1001, "CONSENTED", "GUILTY", new Date("2024-05-10"), 9)
  })

  it("should return a PNC adjudication when NumberOfOffencesTIC, Verdict, PleaStatus have value", () => {
    const result = createPncAdjudicationFromAho(
      [{ NumberOfOffencesTIC: 2, PleaStatus: "DEN", PNCDisposalType: 1000, Verdict: "NC" } as Result],
      new Date("2024-05-10")
    )

    expect(result).toStrictEqual({ dummy: "dummy" })
    expect(mockedCreatePncAdjudication).toHaveBeenCalledWith(
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
      const result = createPncAdjudicationFromAho(
        [{ NumberOfOffencesTIC: 2, PleaStatus: "ADM", PNCDisposalType: 1000, Verdict: verdict } as Result],
        new Date("2024-05-10")
      )

      expect(result).toStrictEqual({ dummy: "dummy" })
      expect(mockedCreatePncAdjudication).toHaveBeenCalledWith(1000, "GUILTY", "GUILTY", new Date("2024-05-10"), 2)
    }
  )

  it.each(verdict.filter((v) => v.cjsCode && v.cjsCode !== "NC"))(
    "should set verdict to $pncCode when verdict is $cjsCode",
    ({ cjsCode, pncCode }) => {
      const result = createPncAdjudicationFromAho(
        [{ NumberOfOffencesTIC: 2, PleaStatus: "ADM", PNCDisposalType: 1000, Verdict: cjsCode } as Result],
        new Date("2024-05-10")
      )

      expect(result).toStrictEqual({ dummy: "dummy" })
      expect(mockedCreatePncAdjudication).toHaveBeenCalledWith(1000, "GUILTY", pncCode, new Date("2024-05-10"), 2)
    }
  )
})
