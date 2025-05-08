import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { initialResultsVisibility } from "./initialResultsVisibility"

describe("initialResultsVisibility", () => {
  it("returns initial hearing results visibility map", () => {
    const courtCase = {
      aho: {
        AnnotatedHearingOutcome: {
          HearingOutcome: {
            Case: {
              HearingDefendant: {
                Offence: [
                  {
                    Result: [
                      {
                        CJSresultCode: 1111
                      },
                      {
                        CJSresultCode: 1122
                      },
                      {
                        CJSresultCode: 1133
                      }
                    ]
                  },
                  {
                    Result: [
                      {
                        CJSresultCode: 2211
                      },
                      {
                        CJSresultCode: 2222
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        Exceptions: []
      }
    } as unknown as DisplayFullCourtCase

    const expectedResult = {
      0: {
        0: true,
        1: true,
        2: true
      },
      1: {
        0: true,
        1: true
      }
    }

    const initialResultsVisibilityMap = initialResultsVisibility(2, courtCase)

    expect(initialResultsVisibilityMap).toEqual(expectedResult)
  })
})
