import { createHOOffence } from "tests/helpers/generateMockOffences"
import hasDuplicateSequenceNumber from "./hasDuplicateSequenceNumber"

describe("hasDuplicateSequenceNumber()", () => {
  it("should testHasDuplicateSequenceNumberOffencesHaveNullCourtCaseAndSameNumbers", () => {
    const offences = [
      createHOOffence({ startDate: "2022-05-01", sequenceNumber: 1 }),
      createHOOffence({ startDate: "2022-05-01", sequenceNumber: 1 })
    ]
    const result = hasDuplicateSequenceNumber(offences[0], offences)
    expect(result).toBe(false)
  })

  it("should testHasDuplicateSequenceNumberOffencesHaveNullCourtCaseAndDifferentNumbers", () => {
    const offences = [
      createHOOffence({ startDate: "2022-05-01", sequenceNumber: 1 }),
      createHOOffence({ startDate: "2022-05-01", sequenceNumber: 2 })
    ]
    const result = hasDuplicateSequenceNumber(offences[0], offences)
    expect(result).toBe(false)
  })

  it("should testHasDuplicateSequenceNumberOffencesInSameCourtCaseButWithDifferentNumbers", () => {
    const offences = [
      createHOOffence({ startDate: "2022-05-01", sequenceNumber: 1, courtCaseReferenceNumber: "123" }),
      createHOOffence({ startDate: "2022-05-01", sequenceNumber: 2, courtCaseReferenceNumber: "123" })
    ]
    const result = hasDuplicateSequenceNumber(offences[0], offences)
    expect(result).toBe(false)
  })

  it("should testHasDuplicateSequenceNumberDuplicatesExistInSameCourtCase", () => {
    const offences = [
      createHOOffence({ startDate: "2022-05-01", sequenceNumber: 1, courtCaseReferenceNumber: "123" }),
      createHOOffence({ startDate: "2022-05-01", sequenceNumber: 1, courtCaseReferenceNumber: "123" })
    ]
    const result = hasDuplicateSequenceNumber(offences[0], offences)
    expect(result).toBe(false)
  })

  it("should testHasDuplicateSequenceNumberDuplicatesExistButInDifferentCourtCases", () => {
    const offences = [
      createHOOffence({ startDate: "2022-05-01", sequenceNumber: 1, courtCaseReferenceNumber: "123" }),
      createHOOffence({ startDate: "2022-05-01", sequenceNumber: 1, courtCaseReferenceNumber: "345" })
    ]
    const result = hasDuplicateSequenceNumber(offences[0], offences)
    expect(result).toBe(false)
  })

  it("should identify duplicate sequence numbers if manually assigned and matching", () => {
    const offences = [
      createHOOffence({ startDate: "2022-05-01", sequenceNumber: 1, manualSequenceNumber: 2 }),
      createHOOffence({ startDate: "2022-05-01", sequenceNumber: 1, manualSequenceNumber: 3 })
    ]
    const result = hasDuplicateSequenceNumber(offences[0], offences)
    expect(result).toBe(true)
  })
})
