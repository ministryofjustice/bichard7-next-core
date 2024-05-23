import type { OffenceReason } from "../../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../../types/ExceptionCode"
import getAreaCode from "../lib/offence/getAreaCode"
import getOffenceCode from "../lib/offence/getOffenceCode"
import isOffenceIgnored from "../lib/offence/isOffenceIgnored"
import lookupOffenceCode from "../lib/offence/lookupOffenceCode"
import type Exception from "../types/Exception"
import type { ExceptionGenerator } from "../types/ExceptionGenerator"

const isNationalOffenceCode = (offenceReason: OffenceReason): boolean =>
  offenceReason.__type === "NationalOffenceReason"

const getExceptionSubPath = (offenceReason: OffenceReason): string[] => {
  if (isNationalOffenceCode(offenceReason)) {
    return ["OffenceCode", "Reason"]
  }

  return ["LocalOffenceCode", "OffenceCode"]
}

const HO100306: ExceptionGenerator = (hearingOutcome) => {
  const generatedExceptions: Exception[] = []

  const areaCode = getAreaCode(hearingOutcome)

  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach(
    (offence, offenceIndex) => {
      const offenceReason = offence.CriminalProsecutionReference.OffenceReason
      if (!offenceReason) {
        return
      }

      const offenceIgnored = isOffenceIgnored(offence)
      const offenceCode = getOffenceCode(offence)
      const offenceCodeLookup = lookupOffenceCode(offenceCode ?? "", offenceReason, areaCode)

      if (!offenceIgnored && !offenceCodeLookup) {
        generatedExceptions.push({
          code: ExceptionCode.HO100306,
          path: [
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            offenceIndex,
            "CriminalProsecutionReference",
            "OffenceReason",
            ...getExceptionSubPath(offenceReason)
          ]
        })
      }
    }
  )

  return generatedExceptions
}

export default HO100306
