import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { range } from "lodash"
import sample from "lodash.sample"

// lodash ranges are not inclusive of the end number
const cjsResultCodeRanges = [
  ...range(4001, 4010),
  ...range(4011, 4018),
  ...range(4020, 4022),
  ...range(4023, 4026),
  ...range(4027, 4036),
  ...range(4046, 4049),
  4050,
  4051,
  ...range(4053, 4059),
  4506,
  4508,
  ...range(4541, 4573),
  ...range(4574),
  ...range(4587, 4590)
]

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  const result = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0]

  if (result.NextResultSourceOrganisation) {
    result.NextResultSourceOrganisation.OrganisationUnitCode = ""
  }

  result.CJSresultCode = sample(cjsResultCodeRanges)!

  aho.Exceptions.push({
    code: ExceptionCode.HO100322,
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      0,
      "Result",
      0,
      "NextResultSourceOrganisation",
      "OrganisationUnitCode"
    ]
  })

  return aho
}
