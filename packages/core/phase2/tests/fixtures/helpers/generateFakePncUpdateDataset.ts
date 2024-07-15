import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import fs from "fs"
import merge from "lodash.merge"
import type { PncUpdateDataset } from "../../../../types/PncUpdateDataset"

const generateFakePncUpdateDataset = (
  overrides: Partial<PncUpdateDataset> = { PncOperations: [] }
): PncUpdateDataset => {
  const exampleAho = fs.readFileSync("./phase1/tests/fixtures/exampleAho.json").toString()
  const basePncUpdateDataset: PncUpdateDataset = JSON.parse(exampleAho.toString(), dateReviver)
  basePncUpdateDataset.PncOperations = basePncUpdateDataset.PncOperations ?? []
  return merge(basePncUpdateDataset, overrides)
}

export default generateFakePncUpdateDataset
