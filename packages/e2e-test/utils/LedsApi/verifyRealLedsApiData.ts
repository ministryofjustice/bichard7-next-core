import expect from "expect"
import { existsSync, readFileSync } from "fs"
import type { LedsBichard } from "../../types/LedsMock"
import { delay } from "../puppeteer-utils"
import fetchCaseDataFromLedsApi from "./fetchCaseDataFromLedsApi"
import snapshotLedsApiData from "./snapshotLedsApiData"

const keysToRedact = [
  "arrestSummonsId",
  "arrestSummonsReference",
  "courtCaseReferenceNumber",
  "courtCaseReference",
  "id",
  "version",
  "offenceId",
  "offenceChargeNumber",
  "courtCaseChargeNumber",
  "arrestChargeNumber",
  "oldCourtCaseReference"
]

const redactFields = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactFields(item)) as T
  }

  return Object.keys(obj).reduce(
    (acc, key) => {
      if (keysToRedact.includes(key)) {
        acc[key] = "[STRIPPED]"
      } else {
        acc[key] = redactFields((obj as Record<string, unknown>)[key])
      }

      return acc
    },
    {} as Record<string, unknown>
  ) as T
}

const deepSort = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (Array.isArray(obj)) {
    const recursed = obj.map(deepSort)
    return recursed.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))) as T
  }

  return Object.keys(obj)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = deepSort((obj as Record<string, unknown>)[key])
        return acc
      },
      {} as Record<string, unknown>
    ) as T
}

const matchRealLedsApiDataToSnapshot = async (bichard: LedsBichard): Promise<void> => {
  const expectedCaseDataPath = `${bichard.specFolder}/police-data.after.json`
  if (!existsSync(expectedCaseDataPath)) {
    throw Error("police-data.after.json file not found. Couldn't verify update.")
  }

  await delay(10)
  const caseData = await fetchCaseDataFromLedsApi(bichard)
  const expectedCaseData = JSON.parse(readFileSync(expectedCaseDataPath, "utf8"))
  const caseDataToCompare = deepSort(redactFields(caseData))
  const expectedCaseDataToCompare = deepSort(redactFields(expectedCaseData))

  expect(caseDataToCompare).toEqual(expectedCaseDataToCompare)
}

const verifyRealLedsApiData = (bichard: LedsBichard): Promise<void> => {
  if (!bichard.policeApi.testApiHelper.getArtifacts().arrestSummonsNumber) {
    return Promise.resolve()
  }

  return bichard.config.policeApiSnapshot
    ? snapshotLedsApiData(bichard, "after")
    : matchRealLedsApiDataToSnapshot(bichard)
}

export default verifyRealLedsApiData
