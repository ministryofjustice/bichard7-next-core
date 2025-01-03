import axios from "axios"

import defaults from "./defaults"

const addMockToPnc = async (matchRegex: string, response: string, count: null | number = null): Promise<string> => {
  const data = { matchRegex, response, count }
  const resp = await axios.post(`http://${defaults.pncHost}:${defaults.pncPort}/mocks`, data)
  if (resp.status < 200 || resp.status >= 300) {
    throw new Error("Error setting mock in PNC Emulator")
  }

  return resp.headers.location!.replace("/mocks/", "")
}

export default addMockToPnc
