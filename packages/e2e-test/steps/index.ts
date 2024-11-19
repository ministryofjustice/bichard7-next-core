import { setDefaultTimeout, setWorldConstructor } from "@cucumber/cucumber"
import { config } from "../utils/config"
import Bichard from "../utils/world"
import { setupHooks } from "./hooks"
import { setupLegacySteps } from "./legacy-ui"
import { setupNextSteps } from "./next-ui"

const { NEXTUI } = process.env

setWorldConstructor(Bichard)
setDefaultTimeout(config.timeout)

if (NEXTUI === "true") {
  setupNextSteps()
} else {
  setupLegacySteps()
}

setupHooks()
