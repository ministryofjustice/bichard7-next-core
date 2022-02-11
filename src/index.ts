import { ExceptionCode } from "./types/ExceptionCode"
import { Trigger } from "./types/Trigger"
import generateTriggers from "./use-cases/generateTriggers"
import parseMessage from "./use-cases/parseMessage"




type BichardResultType = {
    triggers: Trigger[]
    exceptions: ExceptionCode[]
}

export default (message: string): BichardResultType => {
    const courtResult = parseMessage(message)

    const triggers = generateTriggers(courtResult)

    console.log(courtResult)
    return {
        triggers,
        exceptions: []
    }
}
