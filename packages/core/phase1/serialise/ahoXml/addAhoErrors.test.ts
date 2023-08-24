import { ExceptionCode } from "../../../types/ExceptionCode"
import type { AhoXml, Br7Result } from "../../types/AhoXml"
import addAhoErrors from "./addAhoErrors"

describe("addAhoErrors()", () => {
  it("should add an '@_hasError' tag to the Hearing", () => {
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
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing", "HearingDocumentationLanguage"]
      }
    ]

    addAhoErrors(rawAho, exceptions)

    expect(rawAho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Hearing"]["@_hasError"]).toBe(true)
  })

  it("should add an '@_hasError' tag to the Case", () => {
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

    addAhoErrors(rawAho, exceptions)

    expect(rawAho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["@_hasError"]).toBe(true)
  })

  it("should add an '@_hasError' tag to the HearingDefendant", () => {
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
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ]

    addAhoErrors(rawAho, exceptions)

    expect(
      rawAho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"]["@_hasError"]
    ).toBe(true)
  })

  it("should add an '@_hasError' tag to the right Offence", () => {
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
                },
                {
                  "br7:CourtOffenceSequenceNumber": { "#text": "error_here" }
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
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", 1]
      }
    ]

    addAhoErrors(rawAho, exceptions)

    expect(
      rawAho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"][
        "br7:Offence"
      ][1]["@_hasError"]
    ).toBe(true)
  })

  it("should add an '@_hasError' tag to the right Result", () => {
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
                },
                {
                  "br7:CourtOffenceSequenceNumber": { "#text": "random" },
                  "br7:Result": [{ "ds:CJSresultCode": { "#text": "error_here" } }]
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
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", 1, "Result", 0]
      }
    ]

    addAhoErrors(rawAho, exceptions)

    expect(
      (
        rawAho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"][
          "br7:Offence"
        ][1]["br7:Result"] as Br7Result[]
      )[0]["@_hasError"]
    ).toBe(true)
  })
})
