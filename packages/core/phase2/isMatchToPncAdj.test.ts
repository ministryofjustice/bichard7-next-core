import type { PncAdjudication, PncOffence } from "../types/PncQueryResult"
import isMatchToPncAdj from "./isMatchToPncAdj"

describe("check isMatchToPncAdj", () => {
  it("Given an undefined date on the aho adjudication, adjudications do not match", () => {
    const hoAdjudication = {
      verdict: "",
      sentenceDate: undefined,
      offenceTICNumber: 0,
      plea: "GUILTY"
    } as unknown as PncAdjudication

    const pncOffence = {
      offence: {
        sequenceNumber: 1,
        qualifier1: ""
      },
      adjudication: {
        verdict: "GUILTY",
        plea: "GUILTY",
        sentenceDate: new Date(),
        offenceTICNumber: 0,
        weedFlag: undefined
      }
    } as PncOffence
    const result = isMatchToPncAdj(hoAdjudication, pncOffence, "001")
    expect(result).toBe(false)
  })

  it("Given an undefined date on the pnc adjudication, adjudications do not match", () => {
    const hoAdjudication = {
      verdict: "",
      sentenceDate: new Date(),
      offenceTICNumber: 0,
      plea: "GUILTY"
    } as unknown as PncAdjudication

    const pncOffence = {
      offence: {
        sequenceNumber: 1,
        qualifier1: ""
      },
      adjudication: {
        verdict: "GUILTY",
        plea: "GUILTY",
        offenceTICNumber: 0,
        weedFlag: undefined
      }
    } as PncOffence
    const result = isMatchToPncAdj(hoAdjudication, pncOffence, "001")
    expect(result).toBe(false)
  })

  it("Given matching date on the aho adjudication, adjudications match", () => {
    const hoAdjudication = {
      verdict: "MATCHING-VERDICT",
      sentenceDate: new Date("2024-02-02"),
      offenceTICNumber: 0,
      plea: "GUILTY"
    } as PncAdjudication

    const pncOffence = {
      offence: {
        sequenceNumber: 1,
        qualifier1: ""
      },
      adjudication: {
        verdict: "MATCHING-VERDICT",
        plea: "GUILTY",
        sentenceDate: new Date("2024-02-02"),
        offenceTICNumber: 0,
        weedFlag: undefined
      }
    } as PncOffence
    const result = isMatchToPncAdj(hoAdjudication, pncOffence, "001")
    expect(result).toBe(true)
  })

  it("Given no dates, adjudications match", () => {
    const hoAdjudication = {
      verdict: "MATCHING-VERDICT",
      offenceTICNumber: 0,
      plea: "GUILTY"
    } as PncAdjudication

    const pncOffence = {
      offence: {
        sequenceNumber: 1,
        qualifier1: ""
      },
      adjudication: {
        verdict: "MATCHING-VERDICT",
        plea: "GUILTY",
        offenceTICNumber: 0,
        weedFlag: undefined
      }
    } as PncOffence
    const result = isMatchToPncAdj(hoAdjudication, pncOffence, "001")
    expect(result).toBe(true)
  })

  it("Given undefined offenceReasonSequence, adjudications do not match", () => {
    const hoAdjudication = {
      verdict: "MATCHING-VERDICT",
      sentenceDate: new Date("2024-02-02"),
      offenceTICNumber: 0,
      plea: "GUILTY"
    } as PncAdjudication

    const pncOffence = {
      offence: {
        sequenceNumber: 1,
        qualifier1: ""
      },
      adjudication: {
        verdict: "MATCHING-VERDICT",
        plea: "GUILTY",
        sentenceDate: new Date("2024-02-02"),
        offenceTICNumber: 0,
        weedFlag: undefined
      }
    } as PncOffence
    const result = isMatchToPncAdj(hoAdjudication, pncOffence, undefined)
    expect(result).toBe(false)
  })

  it("Given non matching verdicts, adjudications do not match", () => {
    const hoAdjudication = {
      verdict: "NON-MATCHING-VERDICT",
      sentenceDate: new Date("2024-02-02"),
      offenceTICNumber: 0,
      plea: "GUILTY"
    } as PncAdjudication

    const pncOffence = {
      offence: {
        sequenceNumber: 1,
        qualifier1: ""
      },
      adjudication: {
        verdict: "GUILTY",
        plea: "GUILTY",
        sentenceDate: new Date("2024-02-02"),
        offenceTICNumber: 0,
        weedFlag: undefined
      }
    } as PncOffence
    const result = isMatchToPncAdj(hoAdjudication, pncOffence, "001")
    expect(result).toBe(false)
  })
})
