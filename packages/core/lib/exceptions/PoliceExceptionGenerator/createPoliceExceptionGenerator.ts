import type PoliceExceptionGenerator from "../../../phase3/types/PoliceExceptionGenerator"

import LedsExceptionGenerator from "./LedsExceptionGenerator/LedsExceptionGenerator"
import PncExceptionGenerator from "./PncExceptionGenerator/PncExceptionGenerator"

const createPoliceExceptionGenerator = (): PoliceExceptionGenerator => {
  if (process.env.USE_LEDS === "true") {
    return new LedsExceptionGenerator()
  }

  return new PncExceptionGenerator()
}

export default createPoliceExceptionGenerator
