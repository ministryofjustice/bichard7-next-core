import type { BailsReportQuery } from "@moj-bichard7/common/contracts/BailsReport"
import type { DomesticViolenceReportQuery } from "@moj-bichard7/common/contracts/DomesticViolenceReport"
import type { ExceptionReportQuery } from "@moj-bichard7/common/contracts/ExceptionReport"
import type { WarrantsReportQuery } from "@moj-bichard7/common/contracts/WarrantsReport"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply } from "fastify"

import type DatabaseGateway from "../../types/DatabaseGateway"

import { createReportHandler } from "../../useCases/cases/reports/createReportHandler"

type ReportQuery = BailsReportQuery | DomesticViolenceReportQuery | ExceptionReportQuery | WarrantsReportQuery

jest.mock("../../useCases/cases/reports/createReportHandler", () => ({
  createReportHandler: jest.fn()
}))

export const mockReportHandler = <TResult, TChunk>(
  resultToReturn: Error | TResult,
  countToYield?: number,
  errorToThrow?: Error,
  chunkToYield?: TChunk[]
) => {
  ;(createReportHandler as jest.Mock).mockImplementation(
    (
      _strategy: unknown,
      onStreamComplete?: (count: number) => Promise<PromiseResult<void> | void> | PromiseResult<void> | void,
      extractCount?: (chunk: TChunk[]) => number
    ) => {
      return async (_db: DatabaseGateway, _user: User, _query: ReportQuery, _reply: FastifyReply) => {
        if (errorToThrow) {
          throw errorToThrow
        }

        if (resultToReturn instanceof Error) {
          return resultToReturn
        }

        // Trigger if we have a manual count OR a chunk to calculate from
        if (onStreamComplete && (countToYield !== undefined || chunkToYield !== undefined)) {
          const finalCount = extractCount && chunkToYield ? extractCount(chunkToYield) : (countToYield ?? 0)

          const callbackResult = await onStreamComplete(finalCount)

          if (callbackResult instanceof Error) {
            return callbackResult
          }
        }

        return resultToReturn
      }
    }
  )
}
