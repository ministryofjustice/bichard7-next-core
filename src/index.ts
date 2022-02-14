import type BichardResultType from "./types/BichardResultType"
import generateTriggers from "./use-cases/generateTriggers"
import parseMessage from "./use-cases/parseMessage"

export default (message: string): BichardResultType => {
  const courtResult = parseMessage(message)

  const triggers = generateTriggers(courtResult)

  return {
    triggers,
    exceptions: []
  }
}
