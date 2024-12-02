import path from "path"
import fs from "fs"
import parsePncUpdateDataSetXml from "../../../phase2/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
import { isError } from "@moj-bichard7/e2e-tests/utils/isError"
import type { PncOperation } from "../../../types/PncOperation"
import type { Operation } from "../../../types/PncUpdateDataset"
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
})
