import type PncApiConfig from "../types/PncApiConfig"

const createPncApiConfig = (): PncApiConfig => ({
  url: process.env.PNC_API_URL ?? "https://localhost:9443/bichard-api/pnc",
  key: process.env.PNC_API_KEY ?? "super_secret_key"
})

export default createPncApiConfig
