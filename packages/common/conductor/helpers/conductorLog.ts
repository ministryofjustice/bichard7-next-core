import type { TaskExecLog } from "@io-orkes/conductor-javascript"

export const conductorLog = (log: string): TaskExecLog => ({ log, createdTime: new Date().getTime() })
