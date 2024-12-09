import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"

import getPncCheckname from "./getPncCheckname"

const getCheckname = (PNCCheckname: string): AnnotatedHearingOutcome => {
  const aho = {
    Exceptions: [],
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            PNCCheckname: PNCCheckname
          }
        }
      }
    }
  } as unknown as AnnotatedHearingOutcome
  return aho
}

describe("getPncCheckname", () => {
  it("Should return a trimmed string of the PNCCheckname if longer than 12 characters long", () => {
    const aho = getCheckname("AReallyLongPNCCheckname")
    const pncCheckName = getPncCheckname(aho)

    expect(pncCheckName).toBe("AReallyLongP")
  })

  it("Should return a trimmed string of the PNCCheckname if seperated by '/'", () => {
    const aho = getCheckname("PNCCheckname/That/contains/Slashes")
    const pncCheckName = getPncCheckname(aho)

    expect(pncCheckName).toBe("PNCCheckname")
  })
})
