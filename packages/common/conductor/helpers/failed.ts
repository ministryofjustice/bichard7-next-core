import type ConductorTaskResponse from "../types/ConductorTaskResponse"
import { conductorLog } from "./conductorLog"

const failed = (...logs: string[]): ConductorTaskResponse => {
  return Promise.resolve({ status: "FAILED", logs: logs.map(conductorLog) })
}

export default failed
