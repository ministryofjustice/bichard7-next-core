import type { OffenceCode } from "@moj-bichard7-developers/bichard7-next-data/types/types"
import enrichOffence from "src/enrichAho/enrichFunctions/enrichOffences/enrichOffence"
import createCriminalProsecutionRef from "src/lib/offence/createCriminalProsecutionRef"
import getAreaCode from "src/lib/offence/getAreaCode"
import getOffenceCode from "src/lib/offence/getOffenceCode"
import isOffenceCode from "src/lib/offence/isOffenceCode"
import isOffenceIgnored from "src/lib/offence/isOffenceIgnored"
import lookupOffenceCode from "src/lib/offence/lookupOffenceCode"
import parseOffenceReason from "src/lib/offence/parseOffenceReason"
import parseASN from "src/lib/parseASN"
import type { AnnotatedHearingOutcome, Offence } from "src/types/AnnotatedHearingOutcome"
import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import { isLookupOffenceCodeError } from "src/types/LookupOffenceCodeError"
import handle100Offences from "./handle100Offences"

const enrichOffences: EnrichAhoFunction = (hearingOutCome: AnnotatedHearingOutcome) => {
  handle100Offences(hearingOutCome.AnnotatedHearingOutcome.HearingOutcome.Case)

  const parsedASN = parseASN(
    hearingOutCome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  )

  const areaCode = getAreaCode(hearingOutCome)

  hearingOutCome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach(
    (offence: Offence, idx: number) => {
      const offenceReason = offence.CriminalProsecutionReference.OffenceReason
      const offenceCode = getOffenceCode(offence)
      const result = lookupOffenceCode(offenceCode ?? "", offenceReason, areaCode)
      const lookupResult = isOffenceCode(result) ? (result as OffenceCode) : undefined

      const parsedOffenceReason = offenceCode ? parseOffenceReason(offenceCode, areaCode, offenceReason) : undefined

      offence.CriminalProsecutionReference = {
        ...offence.CriminalProsecutionReference,
        ...createCriminalProsecutionRef(parsedASN, parsedOffenceReason)
      }

      const offenceIgnored = isOffenceIgnored(offence)

      offence = enrichOffence(offence, offenceIgnored, lookupResult)

      if (!offenceIgnored && isLookupOffenceCodeError(result)) {
        const enrichedException: Exception = {
          code: ExceptionCode.HO100306,
          path: [
            "AnnotatedHearingOutcome",
            "HearingOutcome",
            "Case",
            "HearingDefendant",
            "Offence",
            idx,
            ...result.subPath
          ]
        }
        hearingOutCome.Exceptions = hearingOutCome.Exceptions
          ? [...hearingOutCome.Exceptions, enrichedException]
          : [enrichedException]
      }
    }
  )
  return hearingOutCome
}

export default enrichOffences
