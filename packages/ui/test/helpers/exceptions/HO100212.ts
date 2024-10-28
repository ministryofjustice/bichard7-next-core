import { faker } from "@faker-js/faker"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail!.PersonName.Title =
    faker.string.alpha(40)

  aho.Exceptions.push({
    code: ExceptionCode.HO100212,
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "DefendantDetail",
      "PersonName",
      "Title"
    ]
  })

  return aho
}
