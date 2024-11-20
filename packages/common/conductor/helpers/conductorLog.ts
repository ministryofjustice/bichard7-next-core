import type { TaskExecLog } from "@io-orkes/conductor-javascript"

export const conductorLog = (log: string): TaskExecLog => ({ createdTime: new Date().getTime(), log })
