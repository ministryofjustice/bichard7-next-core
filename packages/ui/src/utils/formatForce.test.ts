import { Case } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Force } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import formatForce from "./formatForce"

const mockForces = jest.fn()
jest.mock("@moj-bichard7-developers/bichard7-next-data", () => ({
  get forces() {
    return mockForces()
  }
}))

type testData = {
  forceOwner: NonNullable<Case["ForceOwner"]>
  forces: Force[]
  expected: string | undefined
}

describe("formatForce", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const tests: testData[] = [
    {
      forceOwner: { OrganisationUnitCode: "01", SecondLevelCode: "01", ThirdLevelCode: null, BottomLevelCode: null },
      forces: [{ code: "01", name: "Test force name" }],
      expected: "Test force name 01"
    },
    {
      forceOwner: {
        OrganisationUnitCode: "01ABCD",
        SecondLevelCode: "01",
        ThirdLevelCode: "AB",
        BottomLevelCode: "CD"
      },
      forces: [{ code: "01", name: "Test force name" }],
      expected: "Test force name 01ABCD"
    },
    {
      forceOwner: { OrganisationUnitCode: "01", SecondLevelCode: "01", ThirdLevelCode: null, BottomLevelCode: null },
      forces: [],
      expected: "01"
    },
    {
      forceOwner: {
        OrganisationUnitCode: "01ABCD",
        SecondLevelCode: "01",
        ThirdLevelCode: "AB",
        BottomLevelCode: "CD"
      },
      forces: [],
      expected: "01ABCD"
    }
  ]

  it.each(tests)("formatForce %#", (test) => {
    mockForces.mockReturnValue(test.forces)
    expect(formatForce(test.forceOwner)).toStrictEqual(test.expected)
  })
})
