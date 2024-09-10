import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import createSubsequentVariationOperation from "./createSubsequentVariationOperation"
import { PNCMessageType } from "../../../types/operationCodes"

const createAho = (hoCcr: string, pncCourtCases: { offences?: { disposalTypes?: number[] }[]; ccr: string }[]) =>
  ({
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
  }) as unknown as AnnotatedHearingOutcome

describe("createSubsequentVariationOperation", () => {
  it("should return SUBVAR operation without operation data when case is resubmitted", () => {
    const aho = createAho("123", [{ ccr: "123", offences: [{ disposalTypes: [2007] }, { disposalTypes: undefined }] }])

    const { operations, exceptions } = createSubsequentVariationOperation(
      true,
      aho,
      ExceptionCode.HO200212,
      false,
      1,
      1,
      undefined
    )

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: PNCMessageType.DISPOSAL_UPDATED,
        data: undefined,
        status: "NotAttempted"
      }
    ])
  })

  it("should return SUBVAR operation with operation data when case is resubmitted", () => {
    const aho = createAho("123", [{ ccr: "123", offences: [{ disposalTypes: [2007] }] }])

    const { operations, exceptions } = createSubsequentVariationOperation(
      true,
      aho,
      ExceptionCode.HO200212,
      false,
      1,
      1,
      {
        courtCaseReference: "123"
      }
    )

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: PNCMessageType.DISPOSAL_UPDATED,
        data: { courtCaseReference: "123" },
        status: "NotAttempted"
      }
    ])
  })

  it("should return SUBVAR operation with operation data when all PNC results are 2007", () => {
    const aho = createAho("123", [{ ccr: "123", offences: [{ disposalTypes: [2007] }] }])

    const { operations, exceptions } = createSubsequentVariationOperation(
      false,
      aho,
      ExceptionCode.HO200212,
      false,
      1,
      1,
      {
        courtCaseReference: "123"
      }
    )

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: PNCMessageType.DISPOSAL_UPDATED,
        data: { courtCaseReference: "123" },
        status: "NotAttempted"
      }
    ])
  })

  it("should not add SUBVAR operation with operation data when a PNC result is not 2007", () => {
    const aho = createAho("123", [{ ccr: "123", offences: [{ disposalTypes: [2007, 9999] }] }])

    const { operations, exceptions } = createSubsequentVariationOperation(
      false,
      aho,
      ExceptionCode.HO200212,
      true,
      1,
      1,
      {
        courtCaseReference: "123"
      }
    )

    expect(exceptions).toHaveLength(0)
    expect(operations).toHaveLength(0)
  })

  it("should not add SUBVAR operation with operation data when court case reference in operation data does not match any PNC offence", () => {
    const aho = createAho("444", [{ ccr: "123", offences: [{ disposalTypes: [2007] }] }])

    const { operations, exceptions } = createSubsequentVariationOperation(
      false,
      aho,
      ExceptionCode.HO200212,
      true,
      1,
      1,
      {
        courtCaseReference: "333"
      }
    )

    expect(exceptions).toHaveLength(0)
    expect(operations).toHaveLength(0)
  })

  it("should return SUBVAR operation with operation data when operation data is not set but case court reference number does match PNC offences", () => {
    const aho = createAho("123", [{ ccr: "123", offences: [{ disposalTypes: [2007, 2007] }] }])

    const { operations, exceptions } = createSubsequentVariationOperation(
      false,
      aho,
      ExceptionCode.HO200212,
      true,
      1,
      1,
      undefined
    )

    expect(exceptions).toHaveLength(0)
    expect(operations).toStrictEqual([
      {
        code: PNCMessageType.DISPOSAL_UPDATED,
        data: undefined,
        status: "NotAttempted"
      }
    ])
  })

  it("should return an exception using the passed exception code when results are not already on PNC, case is not resubmitted, and there is a non-2007 PNC result", () => {
    const aho = createAho("123", [{ ccr: "123", offences: [{ disposalTypes: [2007, 9999] }] }])

    const { operations, exceptions } = createSubsequentVariationOperation(
      false,
      aho,
      ExceptionCode.HO200212,
      false,
      1,
      1,
      undefined
    )

    expect(exceptions).toStrictEqual([
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
    expect(operations).toHaveLength(0)
  })

  it("should return an exception using the passed exception code when results are not already on PNC, case is not resubmitted, and there are no PNC offences", () => {
    const aho = createAho("123", [{ ccr: "123", offences: undefined }])

    const { operations, exceptions } = createSubsequentVariationOperation(
      false,
      aho,
      ExceptionCode.HO200212,
      false,
      1,
      1,
      undefined
    )

    expect(exceptions).toStrictEqual([
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
    expect(operations).toHaveLength(0)
  })

  it("should return an exception using the passed exception code when results are not already on PNC, case is not resubmitted, and there are no PNC disposal types", () => {
    const aho = createAho("123", [{ ccr: "123", offences: [{ disposalTypes: [] }, { disposalTypes: undefined }] }])

    const { operations, exceptions } = createSubsequentVariationOperation(
      false,
      aho,
      ExceptionCode.HO200212,
      false,
      1,
      1,
      undefined
    )

    expect(exceptions).toStrictEqual([
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
    expect(operations).toHaveLength(0)
  })

  it("should do nothing when results are already on PNC, case is not resubmitted, and there is a non-2007 PNC result", () => {
    const aho = createAho("123", [{ ccr: "123", offences: [{ disposalTypes: [2007, 9999] }] }])

    const { operations, exceptions } = createSubsequentVariationOperation(
      false,
      aho,
      ExceptionCode.HO200212,
      true,
      1,
      1,
      undefined
    )

    expect(exceptions).toHaveLength(0)
    expect(operations).toHaveLength(0)
  })
})
