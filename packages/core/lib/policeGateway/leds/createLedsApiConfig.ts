import type LedsApiConfig from "../../../types/leds/LedsApiConfig"

import { NiamLedsAuthentication } from "./NiamLedsAuthentication"

const createLedsApiConfig = (): LedsApiConfig => ({
  url: process.env.LEDS_API_URL ?? "https://localhost:8443",
  authentication: NiamLedsAuthentication.createInstance()
})

export default createLedsApiConfig
