import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { AhoXml, Br7Result } from "../../types/AhoXml"
import addAhoErrors from "./addAhoErrors"
import Phase from "../../../types/Phase"

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

  describe("Results", () => {
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

    it("should add an '@_hasError' tag to the right Result when Phase 1 and addFalseHasErrorAttributes is false", () => {
      const aho = structuredClone(rawAho)

      addAhoErrors(aho, exceptions, false, Phase.HEARING_OUTCOME)

      expect(
        (
          aho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"][
            "br7:Offence"
          ][1]["br7:Result"] as Br7Result[]
        )[0]["@_hasError"]
      ).toBe(true)
    })

    it("should add an '@_hasError' tag to the right Result when Phase 1 and addFalseHasErrorAttributes is true", () => {
      const aho = structuredClone(rawAho)

      addAhoErrors(aho, exceptions, true, Phase.HEARING_OUTCOME)

      expect(
        (
          aho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"][
            "br7:Offence"
          ][1]["br7:Result"] as Br7Result[]
        )[0]["@_hasError"]
      ).toBe(true)
    })

    it("should add an '@_hasError' tag to the right Result when Phase 2 and addFalseHasErrorAttributes is true", () => {
      const aho = structuredClone(rawAho)

      addAhoErrors(aho, exceptions, true, Phase.PNC_UPDATE)

      expect(
        (
          aho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"][
            "br7:Offence"
          ][1]["br7:Result"] as Br7Result[]
        )[0]["@_hasError"]
      ).toBe(true)
    })

    it("should add an '@_hasError' tag to the Result when Phase 2 and addFalseHasErrorAttributes is true", () => {
      const aho = structuredClone(rawAho)

      addAhoErrors(aho, exceptions, true, Phase.PNC_UPDATE)

      expect(
        (
          aho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"][
            "br7:Offence"
          ][1]["br7:Result"] as Br7Result[]
        )[0]["@_hasError"]
      ).toBe(true)
    })

    it("shouldn't add an '@_hasError' tag to the Result when Phase 2 and addFalseHasErrorAttributes is false", () => {
      const aho = structuredClone(rawAho)

      addAhoErrors(aho, exceptions, false, Phase.PNC_UPDATE)

      expect(
        (
          aho["br7:AnnotatedHearingOutcome"]?.["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"][
            "br7:Offence"
          ][1]["br7:Result"] as Br7Result[]
        )[0]["@_hasError"]
      ).toBeUndefined()
    })
  })
})
