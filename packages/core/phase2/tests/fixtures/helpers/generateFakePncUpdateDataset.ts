import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import fs from "fs"
import merge from "lodash.merge"
import type { AnnotatedHearingOutcome, PartialAho } from "../../../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../../../types/PncUpdateDataset"

const generateFakePncUpdateDataset = (overrides: PartialAho): PncUpdateDataset => {
  const exampleAho = fs.readFileSync("./phase1/tests/fixtures/exampleAho.json").toString()
  const baseAho = JSON.parse(exampleAho.toString(), dateReviver) as AnnotatedHearingOutcome
  const pncUpdateDataset: PncUpdateDataset = {
    ...baseAho,
    PncOperations: []
  }
  return merge(pncUpdateDataset, overrides)
}

export default generateFakePncUpdateDataset
