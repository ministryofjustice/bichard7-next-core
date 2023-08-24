/* eslint-disable @typescript-eslint/no-var-requires */
import { TriggerCode } from "../../types/TriggerCode"
import type { TriggerGenerator } from "../types/TriggerGenerator"

const modules = Object.keys(TriggerCode).reduce((acc: Record<string, TriggerGenerator>, code) => {
  acc[code] = require(`./${code}`).default
  return acc
}, {})

export default modules
