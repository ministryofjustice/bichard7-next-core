import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { OffenceReason } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import getOffenceCode from "../../lib/offences/getOffenceCode"
import getAreaCode from "../lib/offence/getAreaCode"
import isOffenceIgnored from "../lib/offence/isOffenceIgnored"
import lookupOffenceCode from "../lib/offence/lookupOffenceCode"

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
