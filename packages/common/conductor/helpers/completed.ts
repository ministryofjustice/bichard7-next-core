import type ConductorTaskResponse from "../types/ConductorTaskResponse"
import { conductorLog } from "./conductorLog"

function completed(...logs: string[]): ConductorTaskResponse
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function completed(outputData: Record<string, any>, ...logs: string[]): ConductorTaskResponse

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function completed(outputData: Record<string, any> | string, ...logs: string[]): ConductorTaskResponse {
  if (typeof outputData === "string") {
    return Promise.resolve({ status: "COMPLETED", logs: [outputData].concat(logs).map(conductorLog) })
  } else {
    return Promise.resolve({ status: "COMPLETED", logs: logs.map(conductorLog), outputData })
  }
}

export default completed
