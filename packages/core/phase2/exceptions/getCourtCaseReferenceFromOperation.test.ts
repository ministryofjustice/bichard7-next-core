import getCourtCaseReferenceFromOperation from "./getCourtCaseReferenceFromOperation"
import { PncOperation } from "../../types/PncOperation"
import type { Operation } from "../../types/PncUpdateDataset"

const courtCaseSpecificOperations = [
  PncOperation.SENTENCE_DEFERRED,
  PncOperation.NORMAL_DISPOSAL,
  PncOperation.DISPOSAL_UPDATED
]

describe("getCourtCaseReferenceFromOperation", () => {
  it.each(courtCaseSpecificOperations)(
    "returns the court case reference for a %s operation",
    (courtCaseSpecificOperation) => {
      const operation = {
        code: courtCaseSpecificOperation,
        data: {
          courtCaseReference: "CCR"
        }
      } as Operation

      const courtCaseReference = getCourtCaseReferenceFromOperation(operation)

      expect(courtCaseReference).toBe("CCR")
    }
  )

  it.each(courtCaseSpecificOperations)(
    "returns undefined for a %s operation when data doesn't exist",
    (courtCaseSpecificOperation) => {
      const operation = {
        code: courtCaseSpecificOperation
      } as Operation

      const courtCaseReference = getCourtCaseReferenceFromOperation(operation)

      expect(courtCaseReference).toBeUndefined()
    }
  )

  it.each(courtCaseSpecificOperations)(
    "returns undefined for a %s operation when court case reference doesn't exist",
    (courtCaseSpecificOperation) => {
      const operation = {
        code: courtCaseSpecificOperation,
        data: {}
      } as Operation

      const courtCaseReference = getCourtCaseReferenceFromOperation(operation)

      expect(courtCaseReference).toBeUndefined()
    }
  )

  it.each([PncOperation.REMAND, PncOperation.PENALTY_HEARING])(
    "returns undefined for a %s operation",
    (operationWithoutCourtCaseReference) => {
      const operation = {
        code: operationWithoutCourtCaseReference
      } as Operation

      const courtCaseReference = getCourtCaseReferenceFromOperation(operation)

      expect(courtCaseReference).toBeUndefined()
    }
  )
})
