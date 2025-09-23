import type LedsApiConfig from "../../../types/leds/LedsApiConfig"

const createLedsApiConfig = (): LedsApiConfig => ({
  url: process.env.LEDS_API_URL ?? "https://localhost:1080"
})

export default createLedsApiConfig
