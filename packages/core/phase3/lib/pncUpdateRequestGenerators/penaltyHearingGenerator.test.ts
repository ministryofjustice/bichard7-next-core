import { isError } from "@moj-bichard7/common/types/Result"
import fs from "fs"
import path from "path"

import type { Operation } from "../../../types/PncUpdateDataset"

import parsePncUpdateDataSetXml from "../../../lib/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
import { PncOperation } from "../../../types/PncOperation"
import generatePncUpdateDatasetWithOperations from "../../tests/helpers/generatePncUpdateDatasetWithOperations"
import penaltyHearingGenerator from "./penaltyHearingGenerator"

describe("penaltyHearingGenerator", () => {
  it("generates the operation request", () => {
    const filePath = path.join(__dirname, "../../../phase2/tests/fixtures/PncUpdateDataSet-with-single-PENHRG.xml")
    const inputXml = fs.readFileSync(filePath).toString()
    const pncUpdateDataset = parsePncUpdateDataSetXml(inputXml)
    if (isError(pncUpdateDataset)) {
      throw pncUpdateDataset
    }

    const result = penaltyHearingGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[0] as Operation<PncOperation.PENALTY_HEARING>
    )

    expect(result).toMatchSnapshot()
  })

  it("should return error when court case reference in operation and penalty notice case reference number in hearing outcome are undefined", () => {
    const pncUpdateDataset = generatePncUpdateDatasetWithOperations()
    pncUpdateDataset.PncOperations = [
      {
        code: PncOperation.PENALTY_HEARING,
        data: undefined
      } as Operation<PncOperation.PENALTY_HEARING>
    ]
    pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber = undefined

    const result = penaltyHearingGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[0] as Operation<PncOperation.PENALTY_HEARING>
    )

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("Penalty notice case ref is missing")
  })
})
