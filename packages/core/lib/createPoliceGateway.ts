import type PoliceGateway from "../types/PoliceGateway"

import LedsGateway from "./leds/LedsGateway"
import createPncApiConfig from "./pnc/createPncApiConfig"
import PncGateway from "./pnc/PncGateway"

const createPoliceGateway = (): PoliceGateway => {
  if (process.env.USE_LEDS === "true") {
    return new LedsGateway()
  }

  const pncApiConfig = createPncApiConfig()
  return new PncGateway(pncApiConfig)
}

export default createPoliceGateway
