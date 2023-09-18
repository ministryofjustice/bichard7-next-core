import type ConductorTaskResponse from "../types/ConductorTaskResponse"
import { conductorLog } from "./conductorLog"

const failedTerminal = (...logs: string[]): ConductorTaskResponse => {
  return Promise.resolve({ status: "FAILED_WITH_TERMINAL_ERROR", logs: logs.map(conductorLog) })
}

export default failedTerminal
