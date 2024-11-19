import type { Case } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { Force } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

import formatForce from "./formatForce"

const mockForces = jest.fn()
jest.mock("@moj-bichard7-developers/bichard7-next-data", () => ({
  get forces() {
    return mockForces()
  }
}))

type testData = {
  expected: string | undefined
  forceOwner: NonNullable<Case["ForceOwner"]>
  forces: Force[]
}

describe("formatForce", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const tests: testData[] = [
    {
      expected: "Test force name 01",
      forceOwner: { BottomLevelCode: null, OrganisationUnitCode: "01", SecondLevelCode: "01", ThirdLevelCode: null },
      forces: [{ code: "01", name: "Test force name" }]
    },
    {
      expected: "Test force name 01ABCD",
      forceOwner: {
        BottomLevelCode: "CD",
        OrganisationUnitCode: "01ABCD",
        SecondLevelCode: "01",
        ThirdLevelCode: "AB"
      },
      forces: [{ code: "01", name: "Test force name" }]
    },
    {
      expected: "01",
      forceOwner: { BottomLevelCode: null, OrganisationUnitCode: "01", SecondLevelCode: "01", ThirdLevelCode: null },
      forces: []
    },
    {
      expected: "01ABCD",
      forceOwner: {
        BottomLevelCode: "CD",
        OrganisationUnitCode: "01ABCD",
        SecondLevelCode: "01",
        ThirdLevelCode: "AB"
      },
      forces: []
    }
  ]

  it.each(tests)("formatForce %#", (test) => {
    mockForces.mockReturnValue(test.forces)
    expect(formatForce(test.forceOwner)).toStrictEqual(test.expected)
  })
})
