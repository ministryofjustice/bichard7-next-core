import { writeFileSync } from "fs"
import type { LedsBichard } from "../../types/LedsMock"
import { delay } from "../puppeteer-utils"
import fetchCaseDataFromLedsApi from "./fetchCaseDataFromLedsApi"

const snapshotLedsApiData = async (
  bichard: LedsBichard,
  beforeOrAfterRunningTest: "before" | "after"
): Promise<void> => {
  await delay(10)
  const caseData = await fetchCaseDataFromLedsApi(bichard)
  writeFileSync(`${bichard.specFolder}/police-data.${beforeOrAfterRunningTest}.json`, JSON.stringify(caseData, null, 2))
}

export default snapshotLedsApiData
