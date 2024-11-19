import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import getOffenceCode from "../lib/offence/getOffenceCode"

const matchingCodes = ["MC80524", "MC80527", "MC80528"]

const isReopenedOrStatutoryDeclarationCase = (hearingOutcome: AnnotatedHearingOutcome): boolean =>
  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some((offence) =>
    matchingCodes.includes(getOffenceCode(offence) ?? "")
  )

export default isReopenedOrStatutoryDeclarationCase
