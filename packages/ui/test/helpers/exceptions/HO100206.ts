import { faker } from "@faker-js/faker"
import errorPaths from "@moj-bichard7-developers/bichard7-next-core/core/lib/exceptions/errorPaths"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = faker.string.uuid()
  aho.Exceptions.push({
    code: ExceptionCode.HO100206,
    path: errorPaths.case.asn
  })

  return aho
}
