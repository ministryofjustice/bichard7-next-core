import { faker } from "@faker-js/faker"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = faker.string.uuid()
  aho.Exceptions.push({
    code: ExceptionCode.HO100206,
    path: errorPaths.case.asn
  })

  return aho
}
