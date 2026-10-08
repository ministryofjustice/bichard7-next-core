import defaults from "./defaults"

const clearMocksInPnc = async (): Promise<void> => {
  const response = await fetch(`http://${defaults.pncHost}:${defaults.pncPort}/mocks`)
  if (response.status !== 204) {
    throw new Error("Error clearing mocks in PNC Emulator")
  }
}

export default clearMocksInPnc
