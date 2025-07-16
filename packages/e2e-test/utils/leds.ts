import type Bichard from "./world"
import path from "path"
import axios from "axios"

export const mockLedsDataForTest = async function (this: Bichard) {
  const specFolder = path.dirname(this.featureUri)
  const mocks = await import(`../${specFolder}/mock-leds-responses`)
  const url = "http://localhost:1080/mockserver/expectation"

  this.mocks = mocks.default(`${specFolder}/pnc-data.xml`, this)

  for (const mock of this.mocks) {
    await axios.put(url, mock)
  }
}
