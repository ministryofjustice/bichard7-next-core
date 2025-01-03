import axios from "axios"

import defaults from "./defaults"

const clearMocksInPnc = async (): Promise<void> => {
  const response = await axios.delete(`http://${defaults.pncHost}:${defaults.pncPort}/mocks`)
  if (response.status !== 204) {
    throw new Error("Error clearing mocks in PNC Emulator")
  }
}

export default clearMocksInPnc
