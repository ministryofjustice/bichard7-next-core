import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type PncUpdateRequest from "../types/PncUpdateRequest"

import errorPaths from "../../lib/exceptions/errorPaths"
import { PncApiError } from "../../lib/pnc/PncGateway"
import MockPncGateway from "../../tests/helpers/MockPncGateway"
import generatePncUpdateDatasetWithOperations from "../tests/helpers/generatePncUpdateDatasetWithOperations"
import updatePnc from "./updatePnc"

describe("updatePnc", () => {
  const pncUpdateRequest = {} as PncUpdateRequest
  const pncErrorMessage = "PNCUE: Some PNC lock error message"
  const pncLockError = new PncApiError([pncErrorMessage])

  it("returns undefined after successfully retrying a PNC lock error", async () => {
    const pncUpdateDataset = generatePncUpdateDatasetWithOperations()
    const pncGateway = new MockPncGateway([pncLockError, pncLockError, undefined])

    const result = await updatePnc(pncUpdateDataset, pncUpdateRequest, pncGateway)

    expect(result).toBeUndefined()
    expect(pncGateway.updates).toHaveLength(3)
  })

  it("returns an error and adds exception after retrying a PNC lock error for the maximum amount of times", async () => {
    const pncUpdateDataset = generatePncUpdateDatasetWithOperations()
    const pncGateway = new MockPncGateway([pncLockError, pncLockError, pncLockError])

    const result = await updatePnc(pncUpdateDataset, pncUpdateRequest, pncGateway)

    expect(result).toBeInstanceOf(PncApiError)
    expect((result as PncApiError).messages).toStrictEqual(pncLockError.messages)
    expect(pncUpdateDataset.Exceptions).toStrictEqual([
      {
        code: ExceptionCode.HO100404,
        message: pncErrorMessage,
        path: errorPaths.case.asn
      }
    ])
    expect(pncGateway.updates).toHaveLength(3)
  })

  it("returns an error and adds exception after retrying a PNC lock error and then a different error occurs", async () => {
    const pncUpdateDataset = generatePncUpdateDatasetWithOperations()
    const otherPncError = new PncApiError(["I0024 - Some other PNC error"])
    const pncGateway = new MockPncGateway([pncLockError, otherPncError])

    const result = await updatePnc(pncUpdateDataset, pncUpdateRequest, pncGateway)

    expect(result).toBeInstanceOf(PncApiError)
    expect((result as PncApiError).messages).toStrictEqual(otherPncError.messages)
    expect(pncUpdateDataset.Exceptions).toStrictEqual([
      {
        code: ExceptionCode.HO100402,
        message: otherPncError.message,
        path: errorPaths.case.asn
      }
    ])
    expect(pncGateway.updates).toHaveLength(2)
  })
})
