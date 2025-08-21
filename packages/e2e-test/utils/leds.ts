import type Bichard from "./world"
import path from "path"
import axios from "axios"

export const mockLedsDataForTest = async function (this: Bichard) {
  const specFolder = path.dirname(this.featureUri)
  const mocks = await import(`../${specFolder}/mock-leds-responses`)
  const baseUrl = "http://localhost:1080/mockserver"

  this.mocks = mocks.default(`${specFolder}/pnc-data.xml`, this)

  await axios.put(`${baseUrl}/clear`)

  for (const mock of this.mocks) {
    await axios.put(`${baseUrl}/expectation`, mock)
  }
}
