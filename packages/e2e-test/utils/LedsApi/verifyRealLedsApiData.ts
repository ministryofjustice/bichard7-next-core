import type { LedsBichard } from "../../types/LedsMock"
import snapshotLedsApiData from "./snapshotLedsApiData"

const matchRealLedsApiDataToSnapshot = (): Promise<void> => {
  console.log("TODO: Verify API data")

  return Promise.resolve()
}

const verifyRealLedsApiData = (bichard: LedsBichard): Promise<void> => {
  if (!bichard.policeApi.testApiHelper.arrestSummonsNumber) {
    return Promise.resolve()
  }

  return bichard.config.policeApiSnapshot ? snapshotLedsApiData(bichard, "after") : matchRealLedsApiDataToSnapshot()
}

export default verifyRealLedsApiData
