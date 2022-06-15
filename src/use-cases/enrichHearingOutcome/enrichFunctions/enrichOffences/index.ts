import type { OffenceCode } from "@moj-bichard7-developers/bichard7-next-data/types/types"
import parseASN from "src/lib/parseASN"
import parseOffenceReason from "src/lib/parseOffenceReason"
import createCriminalProsecutionRef from "src/utils/offence/createCriminalProsecutionRef"
import getAreaCode from "src/utils/offence/getAreaCode"
import getOffenceCode from "src/utils/offence/getOffenceCode"
import lookupOffenceCode from "src/utils/offence/lookupOffenceCode"
import isOffenceIgnored from "src/use-cases/isOffenceIgnored"
import enrichOffence from "./enrichOffence"
import { ExceptionCode } from "src/types/ExceptionCode"
import isOffenceCode from "src/utils/offence/isOffenceCode"
import { isLookupOffenceCodeError } from "src/types/LookupOffenceCodeError"

import type { AnnotatedHearingOutcome, Offence } from "src/types/AnnotatedHearingOutcome"
import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"
import type Exception from "src/types/Exception"

const enrichOffences: EnrichAhoFunction = (hearingOutCome: AnnotatedHearingOutcome) => {
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
