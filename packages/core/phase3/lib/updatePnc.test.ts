import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"

import type PoliceUpdateRequest from "../types/PoliceUpdateRequest"
import type { default as updatePncType } from "./updatePnc"

import PoliceApiError from "../../lib/policeGateway/PoliceApiError"
import MockPoliceGateway from "../../tests/helpers/MockPoliceGateway"
import generatePncUpdateDatasetWithOperations from "../tests/helpers/generatePncUpdateDatasetWithOperations"

describe("updatePnc", () => {
  describe("when using PNC", () => {
    let updatePnc: typeof updatePncType
    const pncUpdateRequest = {} as PoliceUpdateRequest
    const pncErrorMessage = "PNCUE: Some PNC lock error message"
    const pncLockError = new PoliceApiError([pncErrorMessage])

    beforeEach(async () => {
      process.env.USE_LEDS = undefined
      jest.resetModules()
      updatePnc = (await import("./updatePnc")).default
    })

    it("returns undefined after successfully retrying a PNC lock error", async () => {
      const pncUpdateDataset = generatePncUpdateDatasetWithOperations()
      const pncGateway = new MockPoliceGateway([pncLockError, pncLockError, undefined])

      const result = await updatePnc(pncUpdateDataset, pncUpdateRequest, pncGateway)

      expect(result).toBeUndefined()
      expect(pncGateway.updates).toHaveLength(3)
    })

    it("returns an error and adds exception after retrying a PNC lock error for the maximum amount of times", async () => {
      const pncUpdateDataset = generatePncUpdateDatasetWithOperations()
      const pncGateway = new MockPoliceGateway([pncLockError, pncLockError, pncLockError])

      const result = await updatePnc(pncUpdateDataset, pncUpdateRequest, pncGateway)

      expect(result).toBeInstanceOf(PoliceApiError)
      expect((result as PoliceApiError).messages).toStrictEqual(pncLockError.messages)
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
      const otherPncError = new PoliceApiError(["I0024 - Some other PNC error"])
      const pncGateway = new MockPoliceGateway([pncLockError, otherPncError])

      const result = await updatePnc(pncUpdateDataset, pncUpdateRequest, pncGateway)

      expect(result).toBeInstanceOf(PoliceApiError)
      expect((result as PoliceApiError).messages).toStrictEqual(otherPncError.messages)
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

  describe("when using LEDS", () => {
    let updatePnc: typeof updatePncType
    const pncUpdateRequest = {} as PoliceUpdateRequest

    beforeEach(async () => {
      process.env.USE_LEDS = "true"
      jest.resetModules()
      updatePnc = (await import("./updatePnc")).default
    })

    it("returns undefined when there are no errors", async () => {
      const pncUpdateDataset = generatePncUpdateDatasetWithOperations()
      const ledsGateway = new MockPoliceGateway([undefined])

      const result = await updatePnc(pncUpdateDataset, pncUpdateRequest, ledsGateway)

      expect(result).toBeUndefined()
      expect(pncUpdateDataset.Exceptions).toHaveLength(0)
    })

    it("returns an error and adds exception", async () => {
      const ledsErrorMessage = "PNC Person ID of offence retrieved for update does not match Person URN supplied"
      const ledsError = new PoliceApiError([ledsErrorMessage])
      const pncUpdateDataset = generatePncUpdateDatasetWithOperations()
      const ledsGateway = new MockPoliceGateway([ledsError])

      const result = await updatePnc(pncUpdateDataset, pncUpdateRequest, ledsGateway)

      expect(result).toBeInstanceOf(PoliceApiError)
      expect((result as PoliceApiError).messages).toStrictEqual(ledsError.messages)
      expect(pncUpdateDataset.Exceptions).toStrictEqual([
        {
          code: ExceptionCode.HO100401,
          message: ledsErrorMessage,
          path: errorPaths.case.asn
        }
      ])
      expect(ledsGateway.updates).toHaveLength(1)
    })
  })
})
