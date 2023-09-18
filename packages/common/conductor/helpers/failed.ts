import { conductorLog } from "../logging"
import type ConductorTaskResponse from "../types/ConductorTaskResponse"

const failed = (...logs: string[]): ConductorTaskResponse => {
  return Promise.resolve({ status: "FAILED", logs: logs.map(conductorLog) })
}

export default failed
