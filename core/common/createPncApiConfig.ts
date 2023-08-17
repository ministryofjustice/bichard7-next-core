import type PncApiConfig from "core/phase1/types/PncApiConfig"

const createPncApiConfig = (): PncApiConfig => ({
  url: process.env.PNC_API_URL ?? "https://localhost:9443/bichard-api/pnc",
  key: process.env.PNC_API_KEY ?? "apikey"
})

export default createPncApiConfig
