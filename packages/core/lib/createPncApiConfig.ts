import type PncApiConfig from "@moj-bichard7/common/pnc/PncApiConfig"

const createPncApiConfig = (): PncApiConfig => ({
  url: process.env.PNC_API_URL ?? "https://localhost:9443/bichard-api/pnc",
  key: process.env.PNC_API_KEY ?? "apikey"
})

export default createPncApiConfig
