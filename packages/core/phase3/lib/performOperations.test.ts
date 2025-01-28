import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { Operation } from "../../types/PncUpdateDataset"
import type PncUpdateRequestError from "../types/PncUpdateRequestError"

import MockPncGateway from "../../comparison/lib/MockPncGateway"
import errorPaths from "../../lib/exceptions/errorPaths"
import { PncApiError } from "../../lib/PncGateway"
import { PncOperation } from "../../types/PncOperation"
import generatePncUpdateDatasetWithOperations from "../tests/helpers/generatePncUpdateDatasetWithOperations"
import performOperations from "./performOperations"

describe("performOperations", () => {
  it("returns errors for PNC update requests that cannot be generated", async () => {
    const pncGateway = new MockPncGateway([])

    const normalDisposalOperation: Operation<PncOperation.NORMAL_DISPOSAL> = {
      code: PncOperation.NORMAL_DISPOSAL,
      status: "NotAttempted",
      data: { courtCaseReference: "97/1626/008395Q" }
    }
    const invalidRemandOperation: Operation<PncOperation.REMAND> = { code: PncOperation.REMAND, status: "NotAttempted" }
    const pncUpdateDataset = generatePncUpdateDatasetWithOperations([
      { ...normalDisposalOperation, status: "Completed" },
      normalDisposalOperation,
      { ...normalDisposalOperation, data: { courtCaseReference: "invalid-ccr" } },
      invalidRemandOperation
    ])

    const result = await performOperations(pncUpdateDataset, pncGateway)

    expect(result as PncUpdateRequestError).toHaveProperty("messages", [
      "Operation 2: Court Case Reference Number length must be 15, but the length is 11",
      "Operation 3: Could not find results to use for remand operation."
    ])
    expect(pncGateway.updates).toHaveLength(0)
  })

  it("completes every operation successfully updated by the PNC", async () => {
    const pncGateway = new MockPncGateway([undefined, undefined])

    const completedRemandOperation: Operation<PncOperation.REMAND> = { code: PncOperation.REMAND, status: "Completed" }
    const normalDisposalOperation: Operation<PncOperation.NORMAL_DISPOSAL> = {
      code: PncOperation.NORMAL_DISPOSAL,
      status: "NotAttempted",
      data: { courtCaseReference: "97/1626/008395Q" }
    }
    const sentenceDeferredOperation: Operation<PncOperation.SENTENCE_DEFERRED> = {
      code: PncOperation.SENTENCE_DEFERRED,
      status: "NotAttempted",
      data: { courtCaseReference: "97/1626/008395Q" }
    }
    const pncUpdateDataset = generatePncUpdateDatasetWithOperations([
      completedRemandOperation,
      normalDisposalOperation,
      sentenceDeferredOperation
    ])

    await performOperations(pncUpdateDataset, pncGateway)

    expect(pncUpdateDataset.PncOperations).toStrictEqual([
      completedRemandOperation,
      { ...normalDisposalOperation, status: "Completed" },
      { ...sentenceDeferredOperation, status: "Completed" }
    ])
    expect(pncGateway.updates).toHaveLength(2)
  })

  it("fails an operation unsuccessfully updated by the PNC", async () => {
    const pncGateway = new MockPncGateway([new PncApiError(["I0007: Some PNC error message"])])

    const completedRemandOperation: Operation<PncOperation.REMAND> = { code: PncOperation.REMAND, status: "Completed" }
    const normalDisposalOperation: Operation<PncOperation.NORMAL_DISPOSAL> = {
      code: PncOperation.NORMAL_DISPOSAL,
      status: "NotAttempted",
      data: { courtCaseReference: "97/1626/008395Q" }
    }
    const unattemptedSentenceDeferredOperation: Operation<PncOperation.SENTENCE_DEFERRED> = {
      code: PncOperation.SENTENCE_DEFERRED,
      status: "NotAttempted",
      data: { courtCaseReference: "97/1626/008395Q" }
    }
    const pncUpdateDataset = generatePncUpdateDatasetWithOperations([
      completedRemandOperation,
      normalDisposalOperation,
      unattemptedSentenceDeferredOperation
    ])

    await performOperations(pncUpdateDataset, pncGateway)

    expect(pncUpdateDataset.PncOperations).toStrictEqual([
      completedRemandOperation,
      { ...normalDisposalOperation, status: "Failed" },
      unattemptedSentenceDeferredOperation
    ])
    expect(pncGateway.updates).toHaveLength(1)
  })

  describe("when the PNC returns a lock error", () => {
    const pncErrorMessage = "PNCUE: Some PNC lock error message"
    const pncLockError = new PncApiError([pncErrorMessage])
    const pncOperation: Operation<PncOperation.NORMAL_DISPOSAL> = {
      code: PncOperation.NORMAL_DISPOSAL,
      status: "NotAttempted",
      data: { courtCaseReference: "97/1626/008395Q" }
    }

    it("completes an operation after successfully retrying a PNC lock error", async () => {
      const pncUpdateDataset = generatePncUpdateDatasetWithOperations([{ ...pncOperation }])
      const pncGateway = new MockPncGateway([pncLockError, pncLockError, undefined])

      await performOperations(pncUpdateDataset, pncGateway)

      expect(pncGateway.updates).toHaveLength(3)
      expect(pncUpdateDataset.PncOperations).toStrictEqual([{ ...pncOperation, status: "Completed" }])
    })

    it("fails an operation after retrying a PNC lock error for the maximum amount of times", async () => {
      const pncUpdateDataset = generatePncUpdateDatasetWithOperations([{ ...pncOperation }])
      const pncGateway = new MockPncGateway([pncLockError, pncLockError, pncLockError])

      await performOperations(pncUpdateDataset, pncGateway)

      expect(pncGateway.updates).toHaveLength(3)
      expect(pncUpdateDataset.PncOperations).toStrictEqual([{ ...pncOperation, status: "Failed" }])
      expect(pncUpdateDataset.Exceptions).toStrictEqual([
        {
          code: ExceptionCode.HO100404,
          message: pncErrorMessage,
          path: errorPaths.case.asn
        }
      ])
    })

    it("fails an operation after retrying a PNC lock error and then a different error occurs", async () => {
      const pncUpdateDataset = generatePncUpdateDatasetWithOperations([{ ...pncOperation }])
      const pncGateway = new MockPncGateway([pncLockError, new PncApiError(["I0024 - Some other PNC error"])])

      await performOperations(pncUpdateDataset, pncGateway)

      expect(pncGateway.updates).toHaveLength(2)
      expect(pncUpdateDataset.PncOperations).toStrictEqual([{ ...pncOperation, status: "Failed" }])
      expect(pncUpdateDataset.Exceptions).toStrictEqual([
        {
          code: ExceptionCode.HO100402,
          message: "I0024 - Some other PNC error",
          path: errorPaths.case.asn
        }
      ])
    })
  })
})
