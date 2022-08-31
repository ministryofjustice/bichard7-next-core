import type { Trigger } from "../../types/Trigger"

export type ImportedComparison = {
  file?: string
  incomingMessage: string
  annotatedHearingOutcome: string
  standingDataVersion: string
  triggers: Trigger[]
}
