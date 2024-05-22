import type { HearingOutcome } from "../types/AnnotatedHearingOutcome"

// TODO: Refactor: Remove this function and move the logic to the caller function
const isRecordableOnPnc = (ho: HearingOutcome): boolean => !!ho.Case.RecordableOnPNCindicator

export default isRecordableOnPnc
