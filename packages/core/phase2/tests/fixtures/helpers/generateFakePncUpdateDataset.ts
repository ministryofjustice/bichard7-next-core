import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import fs from "fs"
import merge from "lodash.merge"
import type { PartialPncUpdateDataset } from "../../../../phase1/tests/helpers/PartialPncUpdateDataset"
import type { PncUpdateDataset } from "../../../../types/PncUpdateDataset"

const generateFakePncUpdateDataset = (overrides: PartialPncUpdateDataset = { PncOperations: [] }): PncUpdateDataset => {
  const exampleAho = fs.readFileSync("./phase1/tests/fixtures/exampleAho.json").toString()
  const basePncUpdateDataset: PncUpdateDataset = JSON.parse(exampleAho.toString(), dateReviver)
  return merge(basePncUpdateDataset, overrides)
}

export default generateFakePncUpdateDataset
