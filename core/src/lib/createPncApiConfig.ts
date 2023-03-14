import type PncApiConfig from "src/types/PncApiConfig"

const createPncApiConfig = (): PncApiConfig => ({
  url: process.env.PNC_API_URL ?? "http://localhost:11000",
  key: process.env.PNC_API_KEY ?? "dummy"
})

export default createPncApiConfig
