import type { Offence } from "../../../../types/AnnotatedHearingOutcome"

import getNextResultSourceOrganisationFromOffences from "./getNextResultSourceOrganisationFromOffences"

const nextResultSourceOrganisation = {
  TopLevelCode: "A",
  SecondLevelCode: "01",
  ThirdLevelCode: "01",
  BottomLevelCode: "00",
  OrganisationUnitCode: "A010100"
}

describe("getNextResultSourceOrganisationFromOffences", () => {
  it("should return the first next result source organisation when the next result source organisation has a value and the PNC disposal is 2059", () => {
    const result1 = {
      NextResultSourceOrganisation: undefined,
      PNCDisposalType: 2059
    }
    const result2 = {
      NextResultSourceOrganisation: { ...nextResultSourceOrganisation, TopLevelCode: "C" },
      PNCDisposalType: 2059
    }
    const result3 = {
      NextResultSourceOrganisation: nextResultSourceOrganisation,
      PNCDisposalType: 2060
    }
    const result4 = {
      NextResultSourceOrganisation: { ...nextResultSourceOrganisation, TopLevelCode: "B" },
      PNCDisposalType: 2059
    }
    const offences = [
      {
        Result: [result1, result2]
      },
      {
        Result: [result3, result4]
      }
    ] as Offence[]

    const actualNextResultSourceOrganisation = getNextResultSourceOrganisationFromOffences(offences)

    expect(actualNextResultSourceOrganisation).toStrictEqual({
      ...nextResultSourceOrganisation,
      TopLevelCode: "C"
    })
  })

  it("should return undefined when results either have undefined next result source organisation or PNC disposal is not 2059", () => {
    const result1 = {
      NextResultSourceOrganisation: undefined,
      PNCDisposalType: 2059
    }
    const result2 = {
      NextResultSourceOrganisation: { ...nextResultSourceOrganisation, TopLevelCode: "C" },
      PNCDisposalType: 2065
    }
    const result3 = {
      NextResultSourceOrganisation: nextResultSourceOrganisation,
      PNCDisposalType: 2060
    }
    const result4 = {
      NextResultSourceOrganisation: undefined,
      PNCDisposalType: 2059
    }
    const offences = [
      {
        Result: [result1, result2]
      },
      {
        Result: [result3, result4]
      }
    ] as Offence[]

    const actualNextResultSourceOrganisation = getNextResultSourceOrganisationFromOffences(offences)

    expect(actualNextResultSourceOrganisation).toBeUndefined()
  })
})
