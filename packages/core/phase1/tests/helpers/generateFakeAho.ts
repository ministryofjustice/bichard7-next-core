import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import fs from "fs"
import merge from "lodash.merge"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import { PartialAho } from "./PartialAho"

const generateFakeAho = (overrides: PartialAho): AnnotatedHearingOutcome => {
  const exampleAho = fs.readFileSync("./phase1/tests/fixtures/exampleAho.json").toString()
  const baseAho = JSON.parse(exampleAho.toString(), dateReviver) as AnnotatedHearingOutcome
  return merge(baseAho, overrides)
}

export default generateFakeAho
