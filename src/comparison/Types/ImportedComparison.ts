import type { Trigger } from "src/types/Trigger"

export type ImportedComparison = {
  file?: string
  incomingMessage: string
  annotatedHearingOutcome: string
  triggers: Trigger[]
}
