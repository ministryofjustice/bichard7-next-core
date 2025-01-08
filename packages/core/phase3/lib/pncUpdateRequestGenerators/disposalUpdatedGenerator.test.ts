import { isError } from "@moj-bichard7/common/types/Result"
import fs from "fs"
import path from "path"

import type { PncOperation } from "../../../types/PncOperation"
import type { Operation } from "../../../types/PncUpdateDataset"

import parsePncUpdateDataSetXml from "../../../phase2/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
import disposalUpdatedGenerator from "./disposalUpdatedGenerator"

describe("disposalUpdatedGenerator", () => {
  it("generates the operation request", () => {
    const filePath = path.join(__dirname, "../../../phase2/tests/fixtures/PncUpdateDataSet-with-single-SUBVAR.xml")
    const inputXml = fs.readFileSync(filePath).toString()
    const pncUpdateDataset = parsePncUpdateDataSetXml(inputXml)
    if (isError(pncUpdateDataset)) {
      throw pncUpdateDataset
    }

    const result = disposalUpdatedGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[0] as Operation<PncOperation.DISPOSAL_UPDATED>
    )

    expect(result).toMatchSnapshot()
  })
})
