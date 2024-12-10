import { isError } from "@moj-bichard7/e2e-tests/utils/isError"
import fs from "fs"
import path from "path"

import type { PncOperation } from "../../../../types/PncOperation"
import type { Operation } from "../../../../types/PncUpdateDataset"

import parsePncUpdateDataSetXml from "../../../../phase2/parse/parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"
import remandGenerator from "./remandGenerator"

describe("remandGenerator", () => {
  it("generates the operation request", () => {
    const filePath = path.join(__dirname, "../../../phase2/tests/fixtures/PncUpdateDataSet-with-single-NEWREM.xml")
    const inputXml = fs.readFileSync(filePath).toString()
    const pncUpdateDataset = parsePncUpdateDataSetXml(inputXml)
    if (isError(pncUpdateDataset)) {
      throw pncUpdateDataset
    }

    const result = remandGenerator(
      pncUpdateDataset,
      pncUpdateDataset.PncOperations[0] as Operation<PncOperation.REMAND>
    )

    expect(result).toStrictEqual({
      operation: "NEWREM",
      request: {
        arrestSummonsNumber: "21/0000/00/100019T",
        bailConditions: [],
        courtNameType1: "",
        courtNameType2: "*****FAILED TO APPEAR*****",
        croNumber: null,
        forceStationCode: "01YZ",
        hearingDate: "19122023",
        localAuthorityCode: "0000",
        nextHearingDate: "12022024",
        pncCheckName: "COLE",
        pncIdentifier: "00/X",
        pncRemandStatus: "A",
        psaCourtCode: "9998",
        remandLocationCourt: "2575"
      }
    })
  })
})
