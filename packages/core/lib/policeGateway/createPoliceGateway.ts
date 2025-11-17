import type PoliceGateway from "../../types/PoliceGateway"

import createLedsApiConfig from "./leds/createLedsApiConfig"
import LedsGateway from "./leds/LedsGateway"
import createPncApiConfig from "./pnc/createPncApiConfig"
import PncGateway from "./pnc/PncGateway"

const createPoliceGateway = (): PoliceGateway => {
  if (process.env.USE_LEDS === "true") {
    const ledsApiConfig = createLedsApiConfig()
    return new LedsGateway(ledsApiConfig)
  }

  const pncApiConfig = createPncApiConfig()
  return new PncGateway(pncApiConfig)
}

export default createPoliceGateway
