import { createHOOffence, createPNCCourtCaseOffence } from "tests/helpers/generateMockOffences"
import datesMatchApproximately from "./datesMatchApproximately"

describe("datesMatchApproximately()", () => {
  const doTestOfDatesMatchApproximately = (
    hoStart: string,
    hoEnd: string | null,
    pncStart: string,
    pncEnd: string | null,
    dateCode?: string
  ) => {
    const hoOffence = createHOOffence({
      startDate: hoStart,
      endDate: hoEnd ? hoEnd : undefined
    })

    if (dateCode) {
      hoOffence.ActualOffenceDateCode = dateCode
    }

    const pncOffence = createPNCCourtCaseOffence({
      offenceCode: "VG24030",
      startDate: pncStart,
      endDate: pncEnd ? pncEnd : undefined
    })

    return datesMatchApproximately(hoOffence, pncOffence)
  }

  it("testDatesMatchApproximatelyStartSameEndBothNull", () => {
    const hoStart = "2008-08-08"
    const hoEnd = null
    const pncStart = "08082008"
    const pncEnd = null
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartSameEndHONullPNCSameAsStartDateCode1", () => {
    const hoStart = "2008-08-08"
    const hoEnd = null
    const pncStart = "08082008"
    const pncEnd = "08082008"
    const dateCode = "1"
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartSameEndHONullPNCSameAsStartDateCode5", () => {
    const hoStart = "2008-08-08"
    const hoEnd = null
    const pncStart = "08082008"
    const pncEnd = "08082008"
    const dateCode = "5"
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartSameEndHONullPNCSameAsStartDateCode2", () => {
    const hoStart = "2008-08-08"
    const hoEnd = null
    const pncStart = "08082008"
    const pncEnd = "08082008"
    const dateCode = "2"
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartSameEndHONullPNCNotSameAsStartDateCode1", () => {
    const hoStart = "2008-08-08"
    const hoEnd = null
    const pncStart = "08082008"
    const pncEnd = "09092009"
    const dateCode = "1"
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartSameEndHONullPNCNotSameAsStartDateCode5", () => {
    const hoStart = "2008-08-08"
    const hoEnd = null
    const pncStart = "08082008"
    const pncEnd = "09092009"
    const dateCode = "5"
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartSameEndHONullPNCNotSameAsStartDateCode2", () => {
    const hoStart = "2008-08-08"
    const hoEnd = null
    const pncStart = "08082008"
    const pncEnd = "09092009"
    const dateCode = "2"
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartSameEndHONullPNCBeforeStartDateCode5", () => {
    const hoStart = "2008-08-08"
    const hoEnd = null
    const pncStart = "07082008"
    const pncEnd = "09092009"
    const dateCode = "5"
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartSameEndHONullPNCBeforeStartDateCode2", () => {
    const hoStart = "2008-08-08"
    const hoEnd = null
    const pncStart = "07082008"
    const pncEnd = "09092009"
    const dateCode = "2"
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartSameEndPNCNull", () => {
    const hoStart = "2008-08-08"
    const hoEnd = "2009-09-09"
    const pncStart = "08082008"
    const pncEnd = null
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartSameEndSame", () => {
    const hoStart = "2008-08-08"
    const hoEnd = "2009-09-09"
    const pncStart = "08082008"
    const pncEnd = "09092009"
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartSameEndHOEarlier", () => {
    const hoStart = "2008-08-08"
    const hoEnd = "2009-09-08"
    const pncStart = "08082008"
    const pncEnd = "09092009"
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartSameEndPNCEarlier", () => {
    const hoStart = "2008-08-08"
    const hoEnd = "2009-09-08"
    const pncStart = "08082008"
    const pncEnd = "07092009"
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOEarlierEndBothNull", () => {
    const hoStart = "2008-08-07"
    const hoEnd = null
    const pncStart = "08082008"
    const pncEnd = null
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOEarlierEndHONull", () => {
    const hoStart = "2008-08-07"
    const hoEnd = null
    const pncStart = "08082008"
    const pncEnd = "09092009"
    const dateCode = "1"
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOEarlierEndPNCNull", () => {
    const hoStart = "2008-08-07"
    const hoEnd = "2009-09-09"
    const pncStart = "08082008"
    const pncEnd = null
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOEarlierEndSame", () => {
    const hoStart = "2008-08-07"
    const hoEnd = "2009-09-09"
    const pncStart = "08082008"
    const pncEnd = "09092009"
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOEarlierEndHOEarlier", () => {
    const hoStart = "2008-08-07"
    const hoEnd = "2009-09-08"
    const pncStart = "08082008"
    const pncEnd = "09092009"
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOEarlierEndPNCEarlier", () => {
    const hoStart = "2008-08-07"
    const hoEnd = "2009-09-08"
    const pncStart = "08082008"
    const pncEnd = "07092009"
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOLaterEndBothNull", () => {
    const hoStart = "2008-08-07"
    const hoEnd = null
    const pncStart = "06082008"
    const pncEnd = null
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOLaterEndHONullPNCBeforeHOStart", () => {
    const hoStart = "2008-08-07"
    const hoEnd = null
    const pncStart = "06082008"
    const pncEnd = "06082008"
    const dateCode = "1"
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOLaterEndHONullPNCSameAsHOStartDateCode1", () => {
    const hoStart = "2008-08-07"
    const hoEnd = null
    const pncStart = "06082008"
    const pncEnd = "07082008"
    const dateCode = "1"
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOLaterEndHONullPNCSameAsHOStartDateCode5", () => {
    const hoStart = "2008-08-07"
    const hoEnd = null
    const pncStart = "06082008"
    const pncEnd = "07082008"
    const dateCode = "5"
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOLaterEndHONullPNCSameAsHOStartDateCode2", () => {
    const hoStart = "2008-08-07"
    const hoEnd = null
    const pncStart = "06082008"
    const pncEnd = "07082008"
    const dateCode = "2"
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOLaterEndHONullPNCAfterHOStartDateCode1", () => {
    const hoStart = "2008-08-07"
    const hoEnd = null
    const pncStart = "06082008"
    const pncEnd = "08082008"
    const dateCode = "1"
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOLaterEndHONullPNCAfterHOStartDateCode5", () => {
    const hoStart = "2008-08-07"
    const hoEnd = null
    const pncStart = "06082008"
    const pncEnd = "08082008"
    const dateCode = "5"
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOLaterEndHONullPNCAfterHOStartDateCode2", () => {
    const hoStart = "2008-08-07"
    const hoEnd = null
    const pncStart = "06082008"
    const pncEnd = "08082008"
    const dateCode = "2"
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd, dateCode)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOLaterEndPNCNull", () => {
    const hoStart = "2008-08-07"
    const hoEnd = "2009-09-09"
    const pncStart = "06082008"
    const pncEnd = null
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOLaterEndSame", () => {
    const hoStart = "2008-08-07"
    const hoEnd = "2009-09-09"
    const pncStart = "06082008"
    const pncEnd = "09092009"
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOLaterEndHOEarlier", () => {
    const hoStart = "2008-08-07"
    const hoEnd = "2009-09-08"
    const pncStart = "06082008"
    const pncEnd = "09092009"
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  it("testDatesMatchApproximatelyStartHOLaterEndPNCEarlier", () => {
    const hoStart = "2008-08-07"
    const hoEnd = "2009-09-08"
    const pncStart = "06082008"
    const pncEnd = "07092009"
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  // HO offence start and end dates, and PNC start date, are all equal - this is a match.
  it("testDatesMatchApproximatelySameHOStartAndHOEndAndPNCStart", () => {
    const hoStart = "2011-04-17"
    const hoEnd = "2011-04-17"
    const pncStart = "17042011"
    const pncEnd = null
    const expectedResult = true
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  // PNC offence start date is earlier than HO offence start and end dates - no match,
  // despite HO offence start and end dates being equal
  it("testDatesMatchApproximatelyPNCStartEarlierThanHOStartAndHOEnd", () => {
    const hoStart = "2011-04-17"
    const hoEnd = "2011-04-17"
    const pncStart = "16032010"
    const pncEnd = null
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  // PNC offence start date is later than HO offence start and end dates - no match,
  // despite HO offence start and end dates being equal
  it("testDatesMatchApproximatelyPNCStartLaterThanHOStartAndHOEnd", () => {
    const hoStart = "2011-04-17"
    const hoEnd = "2011-04-17"
    const pncStart = "18052012"
    const pncEnd = null
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  // HO offence start date is earlier than PNC offence start date and HO offence end
  // date - no match, despite PNC offence start date and HO offence end date being equal
  it("testDatesMatchApproximatelyHOStartEarlierThanPNCStartAndHOEnd", () => {
    const hoStart = "2010-03-16"
    const hoEnd = "2011-04-17"
    const pncStart = "17042011"
    const pncEnd = null
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  // HO offence start date is later than PNC offence start date and HO offence end date
  // - no match, despite PNC offence start date and HO offence end date being equal
  it("testDatesMatchApproximatelyHOStartLaterThanPNCStartAndHOEnd", () => {
    const hoStart = "2012-05-18"
    const hoEnd = "2011-04-17"
    const pncStart = "17042011"
    const pncEnd = null
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })

  // HO offence end date is earlier than PNC offence start date and HO offence start
  // date - no match, despite PNC offence start date and HO offence start date being equal
  it("testDatesMatchApproximatelyHOEndEarlierThanPNCStartAndHOStart", () => {
    const hoStart = "2011-04-17"
    const hoEnd = "2010-03-16"
    const pncStart = "17042011"
    const pncEnd = null
    const expectedResult = false
    const actualResult = doTestOfDatesMatchApproximately(hoStart, hoEnd, pncStart, pncEnd)
    expect(actualResult).toBe(expectedResult)
  })
})
