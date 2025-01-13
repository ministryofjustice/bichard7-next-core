import type ConductorTaskResponse from "../types/ConductorTaskResponse"

import { conductorLog } from "./conductorLog"

const failed = (...logs: string[]): ConductorTaskResponse => {
  return Promise.resolve({ logs: logs.map(conductorLog), reasonForIncompletion: logs[0], status: "FAILED" })
}

export default failed
