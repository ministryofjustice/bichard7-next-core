import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import fs from "fs"
import merge from "lodash.merge"

import type { PncUpdateDataset } from "../../../../types/PncUpdateDataset"
import type { PartialPncUpdateDataset } from "../../helpers/PartialPncUpdateDataset"

const generateFakePncUpdateDataset = (overrides: PartialPncUpdateDataset = { PncOperations: [] }): PncUpdateDataset => {
  const exampleAho = fs.readFileSync(__dirname + "/../../../../phase1/tests/fixtures/exampleAho.json").toString()
  const basePncUpdateDataset: PncUpdateDataset = JSON.parse(exampleAho.toString(), dateReviver)
  return merge(basePncUpdateDataset, overrides)
}

export default generateFakePncUpdateDataset
