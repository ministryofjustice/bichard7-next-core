import type ConductorTaskResponse from "../types/ConductorTaskResponse"

import { conductorLog } from "./conductorLog"

const failedTerminal = (...logs: string[]): ConductorTaskResponse => {
  return Promise.resolve({ logs: logs.map(conductorLog), status: "FAILED_WITH_TERMINAL_ERROR" })
}

export default failedTerminal
