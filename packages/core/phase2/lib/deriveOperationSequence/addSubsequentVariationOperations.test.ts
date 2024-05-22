import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../../../types/ExceptionCode"
import addSubsequentVariationOperations from "./addSubsequentVariationOperations"

const createInput = (hoCcr: string, pncCourtCases: { offences?: { disposalTypes?: number[] }[]; ccr: string }[]) => ({
  aho: {
    Exceptions: [],
    AnnotatedHearingOutcome: { HearingOutcome: { Case: { CourtCaseReferenceNumber: hoCcr } } },
    PncQuery: {
      courtCases: pncCourtCases.map((courtCase) => ({
        courtCaseReference: courtCase.ccr,
        offences: courtCase.offences?.map((offence) => ({
          disposals: offence.disposalTypes?.map((type) => ({ type }))
        }))
      }))
    }
  } as unknown as AnnotatedHearingOutcome,
  operations: []
})

describe("addSubsequentVariationOperations", () => {
  it("should add SUBVAR operation without operation data when case is resubmitted", () => {
    const { aho, operations } = createInput("123", [
      { ccr: "123", offences: [{ disposalTypes: [2007] }, { disposalTypes: undefined }] }
    ])

    addSubsequentVariationOperations(true, operations, aho, ExceptionCode.HO200212, false, 1, 1, undefined)

    expect(aho.Exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: "SUBVAR",
        data: undefined,
        status: "NotAttempted"
      }
    ])
  })

  it("should add SUBVAR operation with operation data when case is resubmitted", () => {
    const { aho, operations } = createInput("123", [{ ccr: "123", offences: [{ disposalTypes: [2007] }] }])

    addSubsequentVariationOperations(true, operations, aho, ExceptionCode.HO200212, false, 1, 1, {
      courtCaseReference: "123"
    })

    expect(aho.Exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: "SUBVAR",
        data: { courtCaseReference: "123" },
        status: "NotAttempted"
      }
    ])
  })

  it("should add SUBVAR operation with operation data when all PNC results are 2007", () => {
    const { aho, operations } = createInput("123", [{ ccr: "123", offences: [{ disposalTypes: [2007] }] }])

    addSubsequentVariationOperations(false, operations, aho, ExceptionCode.HO200212, false, 1, 1, {
      courtCaseReference: "123"
    })

    expect(aho.Exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: "SUBVAR",
        data: { courtCaseReference: "123" },
        status: "NotAttempted"
      }
    ])
  })

  it("should not add SUBVAR operation with operation data when a PNC result is not 2007", () => {
    const { aho, operations } = createInput("123", [{ ccr: "123", offences: [{ disposalTypes: [2007, 9999] }] }])

    addSubsequentVariationOperations(false, operations, aho, ExceptionCode.HO200212, true, 1, 1, {
      courtCaseReference: "123"
    })

    expect(aho.Exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([])
  })

  it("should not add SUBVAR operation with operation data when court case reference in operation data does not match any PNC offence", () => {
    const { aho, operations } = createInput("444", [{ ccr: "123", offences: [{ disposalTypes: [2007] }] }])

    addSubsequentVariationOperations(false, operations, aho, ExceptionCode.HO200212, true, 1, 1, {
      courtCaseReference: "333"
    })

    expect(aho.Exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([])
  })

  it("should add SUBVAR operation with operation data when operation data is not set but case court reference number does match PNC offences", () => {
    const { aho, operations } = createInput("123", [{ ccr: "123", offences: [{ disposalTypes: [2007, 2007] }] }])

    addSubsequentVariationOperations(false, operations, aho, ExceptionCode.HO200212, true, 1, 1, undefined)

    expect(aho.Exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: "SUBVAR",
        data: undefined,
        status: "NotAttempted"
      }
    ])
  })

  it("should generate an exception using the passed exception code when results are not already on PNC, case is not resubmitted, and there is a non-2007 PNC result", () => {
    const { aho, operations } = createInput("123", [{ ccr: "123", offences: [{ disposalTypes: [2007, 9999] }] }])

    addSubsequentVariationOperations(false, operations, aho, ExceptionCode.HO200212, false, 1, 1, undefined)

    expect(aho.Exceptions).toStrictEqual([
      {
        code: "HO200212",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          1,
          "Result",
          1,
          "ResultClass"
        ]
      }
    ])
    expect(operations).toStrictEqual([])
  })

  it("should generate an exception using the passed exception code when results are not already on PNC, case is not resubmitted, and there are no PNC offences", () => {
    const { aho, operations } = createInput("123", [{ ccr: "123", offences: undefined }])

    addSubsequentVariationOperations(false, operations, aho, ExceptionCode.HO200212, false, 1, 1, undefined)

    expect(aho.Exceptions).toStrictEqual([
      {
        code: "HO200212",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          1,
          "Result",
          1,
          "ResultClass"
        ]
      }
    ])
    expect(operations).toStrictEqual([])
  })

  it("should generate an exception using the passed exception code when results are not already on PNC, case is not resubmitted, and there are no PNC disposal types", () => {
    const { aho, operations } = createInput("123", [
      { ccr: "123", offences: [{ disposalTypes: [] }, { disposalTypes: undefined }] }
    ])

    addSubsequentVariationOperations(false, operations, aho, ExceptionCode.HO200212, false, 1, 1, undefined)

    expect(aho.Exceptions).toStrictEqual([
      {
        code: "HO200212",
        path: [
          "AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          1,
          "Result",
          1,
          "ResultClass"
        ]
      }
    ])
    expect(operations).toStrictEqual([])
  })

  it("should do nothing when results are already on PNC, case is not resubmitted, and there is a non-2007 PNC result", () => {
    const { aho, operations } = createInput("123", [{ ccr: "123", offences: [{ disposalTypes: [2007, 9999] }] }])

    addSubsequentVariationOperations(false, operations, aho, ExceptionCode.HO200212, true, 1, 1, undefined)

    expect(aho.Exceptions).toHaveLength(0)
    expect(operations).toHaveLength(0)
  })
})
