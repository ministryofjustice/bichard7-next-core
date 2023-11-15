import { ExceptionCode } from "../../../types/ExceptionCode"
import type { AhoXml } from "../../types/AhoXml"
import addExceptionsToAhoXml from "./addExceptionsToAhoXml"

describe("addExceptionsToAhoXml", () => {
  it("should add an exception to the nested element", () => {
    const rawAho: AhoXml = {
      "br7:AnnotatedHearingOutcome": {
        "br7:HearingOutcome": {
          "br7:Hearing": { "ds:HearingDocumentationLanguage": { "#text": "Birmingham" } },
          "br7:Case": {
            "ds:PTIURN": { "#text": "12345" },
            "br7:HearingDefendant": {
              "br7:ArrestSummonsNumber": { "#text": "foo" },
              "br7:Offence": [
                {
                  "br7:CourtOffenceSequenceNumber": { "#text": "bar" }
                }
              ]
            }
          }
        }
      }
    } as AhoXml
    const exceptions = [
      {
        code: ExceptionCode.HO100100,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "PTIURN"]
      }
    ]
    addExceptionsToAhoXml(rawAho, exceptions)
    expect(rawAho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["ds:PTIURN"]["@_Error"]).toBe(
      "HO100100"
    )
  })

  it("should add multiple exception to the nested element", () => {
    const rawAho: AhoXml = {
      "br7:AnnotatedHearingOutcome": {
        "br7:HearingOutcome": {
          "br7:Hearing": { "ds:HearingDocumentationLanguage": { "#text": "Birmingham" } },
          "br7:Case": {
            "ds:PTIURN": { "#text": "12345" },
            "ds:CourtCaseReferenceNumber": { "#text": "12345" },
            "br7:HearingDefendant": {
              "br7:ArrestSummonsNumber": { "#text": "foo" },
              "br7:Offence": [
                {
                  "br7:CourtOffenceSequenceNumber": { "#text": "bar" }
                }
              ]
            }
          }
        }
      }
    } as AhoXml
    const exceptions = [
      {
        code: ExceptionCode.HO100100,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "PTIURN"]
      },
      {
        code: ExceptionCode.HO100200,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "CourtCaseReferenceNumber"]
      }
    ]
    addExceptionsToAhoXml(rawAho, exceptions)
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
    const rawAho: AhoXml = {
      "br7:AnnotatedHearingOutcome": {
        "br7:HearingOutcome": {
          "br7:Hearing": { "ds:HearingDocumentationLanguage": { "#text": "Birmingham" } },
          "br7:Case": {
            "ds:PTIURN": { "#text": "12345" },
            "br7:HearingDefendant": {
              "br7:BailConditions": [{ "#text": "12345" }],
              "br7:ArrestSummonsNumber": { "#text": "foo" },
              "br7:Offence": [
                {
                  "br7:CourtOffenceSequenceNumber": { "#text": "bar" }
                }
              ]
            }
          }
        }
      }
    } as AhoXml

    const exceptions = [
      {
        code: ExceptionCode.HO100100,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "BailConditions", 0]
      }
    ]
    addExceptionsToAhoXml(rawAho, exceptions)
    expect(
      rawAho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"][
        "br7:BailConditions"
      ]?.[0]["@_Error"]
    ).toBe("HO100100")
  })

  it("should add an exception to multiple elements in an array", () => {
    const rawAho: AhoXml = {
      "br7:AnnotatedHearingOutcome": {
        "br7:HearingOutcome": {
          "br7:Hearing": { "ds:HearingDocumentationLanguage": { "#text": "Birmingham" } },
          "br7:Case": {
            "ds:PTIURN": { "#text": "12345" },
            "br7:HearingDefendant": {
              "br7:BailConditions": [{ "#text": "12345" }, { "#text": "12345" }],
              "br7:ArrestSummonsNumber": { "#text": "foo" },
              "br7:Offence": [
                {
                  "br7:CourtOffenceSequenceNumber": { "#text": "bar" }
                }
              ]
            }
          }
        }
      }
    } as AhoXml
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
    addExceptionsToAhoXml(rawAho, exceptions)
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
})
