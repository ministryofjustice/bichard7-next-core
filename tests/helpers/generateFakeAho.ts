import fs from "fs"
import merge from "lodash.merge"
import { dateReviver } from "src/lib/axiosDateTransformer"
import type { AnnotatedHearingOutcome, PartialAho } from "src/types/AnnotatedHearingOutcome"

const generateFakeAho = (overrides: PartialAho): AnnotatedHearingOutcome => {
  const exampleAho = fs.readFileSync("./test-data/exampleAho.json").toString()
  const baseAho = JSON.parse(exampleAho.toString(), dateReviver) as AnnotatedHearingOutcome
  return merge(baseAho, overrides)
}

export default generateFakeAho
