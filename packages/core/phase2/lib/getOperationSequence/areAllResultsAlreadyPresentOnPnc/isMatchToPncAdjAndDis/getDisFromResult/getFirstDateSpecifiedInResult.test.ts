import type { Result } from "../../../../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../../../../types/ResultClass"
import getFirstDateSpecifiedInResult from "./getFirstDateSpecifiedInResult"

const acceptedResultClasses = [
  ResultClass.ADJOURNMENT_PRE_JUDGEMENT,
  ResultClass.ADJOURNMENT_WITH_JUDGEMENT,
  ResultClass.ADJOURNMENT_POST_JUDGEMENT
]

const unacceptedResultClasses = Object.entries(ResultClass)
  .map(([_, value]) => value)
  .filter((value) => !acceptedResultClasses.includes(value))

describe("getFirstDateSpecifiedInResult", () => {
  it("should return the correct date when first DateSpecifiedInResult's sequence is 1", () => {
    const dateResult = getFirstDateSpecifiedInResult({
      DateSpecifiedInResult: [
        { Date: new Date("2024-05-15"), Sequence: 1 },
        { Date: new Date("2024-05-20"), Sequence: 2 }
      ]
    } as Result)

    expect(dateResult?.toISOString()).toBe(new Date("2024-05-15").toISOString())
  })

  it("should return the correct date when second DateSpecifiedInResult's sequence is 1", () => {
    const dateResult = getFirstDateSpecifiedInResult({
      DateSpecifiedInResult: [
        { Date: new Date("2024-05-20"), Sequence: 2 },
        { Date: new Date("2024-05-15"), Sequence: 1 }
      ]
    } as Result)

    expect(dateResult?.toISOString()).toBe(new Date("2024-05-15").toISOString())
  })

  it("should return the correct date when first DateSpecifiedInResult's sequence is 2", () => {
    const dateResult = getFirstDateSpecifiedInResult({
      DateSpecifiedInResult: [
        { Date: new Date("2024-05-16"), Sequence: 2 },
        { Date: new Date("2024-05-21"), Sequence: 3 }
      ]
    } as Result)

    expect(dateResult?.toISOString()).toBe(new Date("2024-05-16").toISOString())
  })

  it("should return the correct date when second DateSpecifiedInResult's sequence is 2", () => {
    const dateResult = getFirstDateSpecifiedInResult({
      DateSpecifiedInResult: [
        { Date: new Date("2024-05-21"), Sequence: 3 },
        { Date: new Date("2024-05-16"), Sequence: 2 }
      ]
    } as Result)

    expect(dateResult?.toISOString()).toBe(new Date("2024-05-16").toISOString())
  })

  it.each(acceptedResultClasses)(
    "should return NextHearingDate when DateSpecifiedInResult is undefined, NextHearingDate has value, and ResultClass is %s",
    (resultClass) => {
      const dateResult = getFirstDateSpecifiedInResult({
        DateSpecifiedInResult: undefined,
        ResultClass: resultClass,
        NextHearingDate: new Date("2024-05-18")
      } as Result)

      expect(dateResult?.toISOString()).toBe(new Date("2024-05-18").toISOString())
    }
  )

  it.each(acceptedResultClasses)(
    "should return NextHearingDate when DateSpecifiedInResult is empty, NextHearingDate has value, and ResultClass is %s",
    (resultClass) => {
      const dateResult = getFirstDateSpecifiedInResult({
        DateSpecifiedInResult: [],
        ResultClass: resultClass,
        NextHearingDate: new Date("2024-05-18")
      } as unknown as Result)

      expect(dateResult?.toISOString()).toBe(new Date("2024-05-18").toISOString())
    }
  )

  it.each(acceptedResultClasses)(
    "should return undefined when DateSpecifiedInResult is empty, ResultClass is %s, and NextHearingDate is undefined",
    (resultClass) => {
      const dateResult = getFirstDateSpecifiedInResult({
        DateSpecifiedInResult: [],
        ResultClass: resultClass,
        NextHearingDate: undefined
      } as unknown as Result)

      expect(dateResult).toBeUndefined()
    }
  )

  it.each(unacceptedResultClasses)(
    "should return undefined when DateSpecifiedInResult is undefined, NextHearingDate has value, and ResultClass is %s",
    (resultClass) => {
      const dateResult = getFirstDateSpecifiedInResult({
        DateSpecifiedInResult: undefined,
        ResultClass: resultClass,
        NextHearingDate: new Date("2024-05-18")
      } as Result)

      expect(dateResult).toBeUndefined()
    }
  )

  it("should return undefined when DateSpecifiedInResult is undefined, NextHearingDate has value, and ResultClass is undefined", () => {
    const dateResult = getFirstDateSpecifiedInResult({
      DateSpecifiedInResult: undefined,
      ResultClass: undefined,
      NextHearingDate: new Date("2024-05-18")
    } as Result)

    expect(dateResult).toBeUndefined()
  })
})
