import { isError } from "@moj-bichard7/common/types/Result"
import fs from "fs"
import path from "path"

import type { Operation, PncUpdateDataset } from "../../../types/PncUpdateDataset"

import parsePncUpdateDataSetXml from "../../../phase2/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
import { PncOperation } from "../../../types/PncOperation"
import sentenceDeferredGenerator from "./sentenceDeferredGenerator"

describe("sentenceDeferredGenerator", () => {
  it("generates the operation request", () => {
    const filePath = path.join(__dirname, "../../../phase2/tests/fixtures/PncUpdateDataSet-with-operations.xml")
    const inputXml = fs.readFileSync(filePath).toString()
    const pncUpdateDataset = parsePncUpdateDataSetXml(inputXml)
    if (isError(pncUpdateDataset)) {
      throw pncUpdateDataset
    }

    const result = sentenceDeferredGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[2] as Operation<PncOperation.SENTENCE_DEFERRED>
    )

    expect(result).toMatchSnapshot()
  })

  it("should return error when court case reference in operation is invalid", () => {
    const pncUpdateDataset = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {},
          Hearing: {}
        }
      },
      Exceptions: [],
      PncOperations: [
        {
          code: PncOperation.SENTENCE_DEFERRED,
          data: {
            courtCaseReference: "invalid"
          }
        }
      ]
    } as unknown as PncUpdateDataset

    const result = sentenceDeferredGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[0] as Operation<PncOperation.SENTENCE_DEFERRED>
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Court Case Reference Number length must be 15, but the length is 7")
  })

  it("should return error when court case reference in hearing outcome case is invalid", () => {
    const pncUpdateDataset = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            CourtCaseReferenceNumber: "invalid2"
          },
          Hearing: {}
        }
      },
      Exceptions: [],
      PncOperations: [
        {
          code: PncOperation.DISPOSAL_UPDATED
        }
      ]
    } as unknown as PncUpdateDataset

    const result = sentenceDeferredGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[0] as Operation<PncOperation.SENTENCE_DEFERRED>
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Court Case Reference Number length must be 15, but the length is 8")
  })
})
