import type BichardResultType from "./types/BichardResultType"
import generateTriggers from "./use-cases/generateTriggers"
import parseMessage from "./use-cases/parseMessage"
// import transformSpiToAnnotatedHearingOutcome from "./use-cases/transformSpiToAnnotatedHearingOutcome"

export default (message: string, recordable: boolean): BichardResultType => {
  // const annotatedHearingOutcome = transformSpiToAnnotatedHearingOutcome(message)
  const courtResult = parseMessage(message)

  const triggers = generateTriggers(courtResult, recordable)

  return {
    triggers,
    exceptions: []
  }
}
