import { dateReviver } from "common/axiosDateTransformer"
import type { AnnotatedHearingOutcome, PartialAho } from "core/phase1/types/AnnotatedHearingOutcome"
import fs from "fs"
import merge from "lodash.merge"

const generateFakeAho = (overrides: PartialAho): AnnotatedHearingOutcome => {
  const exampleAho = fs.readFileSync("./tests/fixtures/exampleAho.json").toString()
  const baseAho = JSON.parse(exampleAho.toString(), dateReviver) as AnnotatedHearingOutcome
  return merge(baseAho, overrides)
}

export default generateFakeAho
