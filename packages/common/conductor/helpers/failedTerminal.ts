import { conductorLog } from "../logging"
import type ConductorTaskResponse from "../types/ConductorTaskResponse"

const failedTerminal = (...logs: string[]): ConductorTaskResponse => {
  return Promise.resolve({ status: "FAILED_WITH_TERMINAL_ERROR", logs: logs.map(conductorLog) })
}

export default failedTerminal
