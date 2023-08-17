import type { AnnotatedHearingOutcome } from "core/phase1/types/AnnotatedHearingOutcome"
import getOffenceCode from "./offence/getOffenceCode"

const matchingCodes = ["MC80524", "MC80527", "MC80528"]

const isReopenedOrStatutoryDeclarationCase = (hearingOutcome: AnnotatedHearingOutcome): boolean =>
  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some((offence) =>
    matchingCodes.includes(getOffenceCode(offence) ?? "")
  )

export default isReopenedOrStatutoryDeclarationCase
