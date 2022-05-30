import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import convertAhoToXml from "./generateAhoXml"

describe("convertAhoToXml", () => {
  it("converts an AHO object into the correct XML format", () => {
    const hearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            CourtHouseCode: 123,
            CourtHearingLocation: {
              TopLevelCode: "a",
              SecondLevelCode: "bc",
              ThirdLevelCode: "de",
              BottomLevelCode: "fg"
            }
          }
        }
      },
      PncQuery: {
        forceStationCode: "01ZD",
        checkName: "SEXOFFENCE",
        pncId: "2000/0448754K",
        cases: {}
      }
    } as AnnotatedHearingOutcome

    expect(convertAhoToXml(hearingOutcome)).toBe(
      '"<?xml version=\\"1.0\\" encoding=\\"UTF-8\\" standalone=\\"yes\\"?>\\n<AnnotatedHearingOutcome>\\n  <HearingOutcome>\\n    <Hearing>\\n      <CourtHouseCode>123</CourtHouseCode>\\n      <CourtHearingLocation>\\n        <TopLevelCode>a</TopLevelCode>\\n        <SecondLevelCode>bc</SecondLevelCode>\\n        <ThirdLevelCode>de</ThirdLevelCode>\\n        <BottomLevelCode>fg</BottomLevelCode>\\n      </CourtHearingLocation>\\n    </Hearing>\\n  </HearingOutcome>\\n</AnnotatedHearingOutcome>"'
    )
  })
})
