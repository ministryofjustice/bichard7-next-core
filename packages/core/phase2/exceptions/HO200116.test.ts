import generator from "./HO200116"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"

const runTest = (offenceCount: number, expectedExceptions: any[]) => {
  const offences = new Array(offenceCount).fill({}) as Offence[]
  const mockAho = generateAhoFromOffenceList(offences)
  const exceptions = generator(mockAho, {})
  expect(exceptions).toStrictEqual(expectedExceptions)
}

describe("HO200116", () => {
  it("should return HO200116 exception when offences exceed 100", () => {
    runTest(101, [
      {
        code: ExceptionCode.HO200116,
        path: errorPaths.case.asn
      }
    ])
  })

  it("should not return any exception when offences are 100", () => {
    runTest(100, [])
  })

  it("should not return any exception when offences are less than 100", () => {
    runTest(99, [])
  })
})
