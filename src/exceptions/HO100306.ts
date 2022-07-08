import getAreaCode from "src/lib/offence/getAreaCode"
import getOffenceCode from "src/lib/offence/getOffenceCode"
import isOffenceIgnored from "src/lib/offence/isOffenceIgnored"
import lookupOffenceCode from "src/lib/offence/lookupOffenceCode"
import type { OffenceReason } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"

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
