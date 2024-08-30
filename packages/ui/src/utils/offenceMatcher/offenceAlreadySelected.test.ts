import { Amendments } from "types/Amendments"
import offenceAlreadySelected from "./offenceAlreadySelected"

describe("offenceAlreadySelected", () => {
  it("should get false as there are no Amendments", () => {
    const amendments: Amendments = {}
    const offenceIndex = 0
    const sequenceNumber = 1
    const courtCaseReference = "97/1626/008395Q"

    const result = offenceAlreadySelected(amendments, offenceIndex, sequenceNumber, courtCaseReference)
    expect(result).toBe(false)
  })

  describe("with one amendment", () => {
    const courtCaseReference = "97/1626/008395Q"
    const amendments: Amendments = {
      offenceReasonSequence: [{ offenceIndex: 0, value: 1 }],
      offenceCourtCaseReferenceNumber: [{ offenceIndex: 0, value: courtCaseReference }]
    }

    it("should be false if we're looking at offence index 0 and our Sequence Number is 1", () => {
      const offenceIndex = 0
      const sequenceNumber = 1

      const result = offenceAlreadySelected(amendments, offenceIndex, sequenceNumber, courtCaseReference)
      expect(result).toBe(false)
    })

    it("should be false if we're looking offence index 0 and our Sequence Number is 2", () => {
      const offenceIndex = 0
      const sequenceNumber = 2

      const result = offenceAlreadySelected(amendments, offenceIndex, sequenceNumber, courtCaseReference)
      expect(result).toBe(false)
    })

    it("should be true if we're looking offence index 1 and our Sequence Number is 1", () => {
      const offenceIndex = 1
      const sequenceNumber = 1

      const result = offenceAlreadySelected(amendments, offenceIndex, sequenceNumber, courtCaseReference)
      expect(result).toBe(true)
    })
  })

  describe("with two amendments", () => {
    let courtCaseReference: string
    let amendments: Amendments

    beforeEach(() => {
      courtCaseReference = "97/1626/008395Q"
      amendments = {
        offenceReasonSequence: [
          { offenceIndex: 0, value: 1 },
          { offenceIndex: 3, value: 0 }
        ],
        offenceCourtCaseReferenceNumber: [
          { offenceIndex: 0, value: courtCaseReference },
          { offenceIndex: 3, value: "" }
        ]
      }
    })

    it("should return false if we're looking at offence index 0 and our Sequence Number is 1", () => {
      const offenceIndex = 0
      const sequenceNumber = 1
      const result = offenceAlreadySelected(amendments, offenceIndex, sequenceNumber, courtCaseReference)
      expect(result).toBe(false)
    })

    it("should return false if we're looking at offence index 3 and our Sequence Number is 4", () => {
      const offenceIndex = 3
      const sequenceNumber = 4
      courtCaseReference = ""
      const result = offenceAlreadySelected(amendments, offenceIndex, sequenceNumber, courtCaseReference)
      expect(result).toBe(false)
    })

    it("should return true if offenceReasonSequence is 0", () => {
      const offenceIndex = 3
      const sequenceNumber = 1
      const result = offenceAlreadySelected(amendments, offenceIndex, sequenceNumber, courtCaseReference)
      expect(result).toBe(true)
    })

    it("should return true if we're looking at offence index 3 and our Sequence Number is 1", () => {
      const offenceIndex = 3
      const sequenceNumber = 1
      const result = offenceAlreadySelected(amendments, offenceIndex, sequenceNumber, courtCaseReference)
      expect(result).toBe(true)
    })
  })

  describe("with two court cases", () => {
    const courtCaseReference1 = "97/1626/008395Q"
    const courtCaseReference2 = "12/2732/000016T"

    const amendments: Amendments = {
      offenceReasonSequence: [
        { offenceIndex: 0, value: 1 },
        { offenceIndex: 3, value: 1 }
      ],
      offenceCourtCaseReferenceNumber: [
        { offenceIndex: 0, value: courtCaseReference1 },
        { offenceIndex: 3, value: courtCaseReference2 }
      ]
    }

    it("should return true when looking at offence index 3 with sequence number 1 and court case 97/1626/008395Q", () => {
      const offenceIndex = 3
      const sequenceNumber = 1

      const result = offenceAlreadySelected(amendments, offenceIndex, sequenceNumber, courtCaseReference1)
      expect(result).toBe(true)
    })

    it("should return false when looking at offence index 0 with sequence number 1 and court case 97/1626/008395Q", () => {
      const offenceIndex = 0
      const sequenceNumber = 1

      const result = offenceAlreadySelected(amendments, offenceIndex, sequenceNumber, courtCaseReference1)
      expect(result).toBe(false)
    })

    it("should return true when looking at offence index 0 with sequence number 1 and court case 12/2732/000016T", () => {
      const offenceIndex = 0
      const sequenceNumber = 1

      const result = offenceAlreadySelected(amendments, offenceIndex, sequenceNumber, courtCaseReference2)
      expect(result).toBe(true)
    })

    it("should return false when looking at offence index 1 with sequence number 1 and court case 12/2732/000016T", () => {
      const offenceIndex = 1
      const sequenceNumber = 1

      const result = offenceAlreadySelected(amendments, offenceIndex, sequenceNumber, courtCaseReference2)
      expect(result).toBe(true)
    })
  })
})
