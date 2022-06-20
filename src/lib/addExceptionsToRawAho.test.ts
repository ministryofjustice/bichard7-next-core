import { ExceptionCode } from "src/types/ExceptionCode"
import type { RawAho } from "src/types/RawAho"
import addExceptionsToRawAho from "./addExceptionsToRawAho"

describe("addExceptionsToRawAho", () => {
  it("should add an exception to the nested element", () => {
    const rawAho: RawAho = {
      "br7:AnnotatedHearingOutcome": { "br7:HearingOutcome": { "br7:Case": { "ds:PTIURN": { "#text": "12345" } } } }
    } as RawAho
    const exceptions = [
      { code: ExceptionCode.HO100100, path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "PTIURN"] }
    ]
    addExceptionsToRawAho(rawAho, exceptions)
    expect(rawAho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["ds:PTIURN"]["@_Error"]).toBe(
      "HO100100"
    )
  })
  it("should add multiple exception to the nested element", () => {
    const rawAho: RawAho = {
      "br7:AnnotatedHearingOutcome": {
        "br7:HearingOutcome": {
          "br7:Case": { "ds:PTIURN": { "#text": "12345" }, "ds:CourtCaseReferenceNumber": { "#text": "12345" } }
        }
      }
    } as RawAho
    const exceptions = [
      { code: ExceptionCode.HO100100, path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "PTIURN"] },
      {
        code: ExceptionCode.HO100200,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "CourtCaseReferenceNumber"]
      }
    ]
    addExceptionsToRawAho(rawAho, exceptions)
    expect(rawAho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["ds:PTIURN"]["@_Error"]).toBe(
      "HO100100"
    )
    expect(
      rawAho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["ds:CourtCaseReferenceNumber"]?.[
        "@_Error"
      ]
    ).toBe("HO100200")
  })

  it("should add an exception to an element in an array", () => {
    const rawAho: RawAho = {
      "br7:AnnotatedHearingOutcome": {
        "br7:HearingOutcome": {
          "br7:Case": { "br7:HearingDefendant": { "br7:BailConditions": [{ "#text": "12345" }] } }
        }
      }
    } as RawAho
    const exceptions = [
      {
        code: ExceptionCode.HO100100,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "BailConditions", 0]
      }
    ]
    addExceptionsToRawAho(rawAho, exceptions)
    expect(
      rawAho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"][
        "br7:BailConditions"
      ]?.[0]["@_Error"]
    ).toBe("HO100100")
  })

  it("should add an exception to multiple elements in an array", () => {
    const rawAho: RawAho = {
      "br7:AnnotatedHearingOutcome": {
        "br7:HearingOutcome": {
          "br7:Case": { "br7:HearingDefendant": { "br7:BailConditions": [{ "#text": "12345" }, { "#text": "12345" }] } }
        }
      }
    } as RawAho
    const exceptions = [
      {
        code: ExceptionCode.HO100100,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "BailConditions", 0]
      },
      {
        code: ExceptionCode.HO100200,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "BailConditions", 1]
      }
    ]
    addExceptionsToRawAho(rawAho, exceptions)
    expect(
      rawAho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"][
        "br7:BailConditions"
      ]?.[0]["@_Error"]
    ).toBe("HO100100")
    expect(
      rawAho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"][
        "br7:BailConditions"
      ]?.[1]["@_Error"]
    ).toBe("HO100200")
  })

  it("should return an error if it can't find the element", () => {
    const rawAho: RawAho = {
      "br7:AnnotatedHearingOutcome": { "br7:HearingOutcome": { "br7:Case": { "ds:PTIURN": { "#text": "12345" } } } }
    } as RawAho
    const exceptions = [
      { code: ExceptionCode.HO100100, path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "Foo"] }
    ]
    const result = addExceptionsToRawAho(rawAho, exceptions)
    expect(result).toBeInstanceOf(Error)
  })
})
