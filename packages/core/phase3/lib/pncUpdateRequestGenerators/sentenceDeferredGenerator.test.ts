import { isError } from "@moj-bichard7/e2e-tests/utils/isError"
import fs from "fs"
import path from "path"

import type { PncOperation } from "../../../types/PncOperation"
import type { Operation } from "../../../types/PncUpdateDataset"

import parsePncUpdateDataSetXml from "../../../phase2/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
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
})
