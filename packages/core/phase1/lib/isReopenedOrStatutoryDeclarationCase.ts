import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import getOffenceCode from "../../lib/offences/getOffenceCode"

const matchingCodes = ["MC80524", "MC80527", "MC80528"]

const isReopenedOrStatutoryDeclarationCase = (hearingOutcome: AnnotatedHearingOutcome): boolean =>
  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some((offence) =>
    matchingCodes.includes(getOffenceCode(offence) ?? "")
  )

export default isReopenedOrStatutoryDeclarationCase
