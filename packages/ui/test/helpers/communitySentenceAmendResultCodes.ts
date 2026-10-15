import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const SUSPENDED_SENTENCE_ORDER_RESULT_CODES = [1115, 1134, 1508, 1507]
const OTHER_SENTENCING_ACT_RESULT_CODES = [1030, 1032, 4575, 4576, 4577]
const OTHER_RESULT_CODES = [1, 2, 3]

// Updates result codes and duration (where applicable) to create dummy data specific to community sentences
const communitySentenceAmendResultCodes = (aho: AnnotatedHearingOutcome) => {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence) => {
    offence.Result.forEach((result) => {
      const RESULT_CODE_GROUPS = [
        SUSPENDED_SENTENCE_ORDER_RESULT_CODES,
        OTHER_SENTENCING_ACT_RESULT_CODES,
        OTHER_RESULT_CODES
      ]

      function getRandomResultCode(): number {
        const randomGroup = RESULT_CODE_GROUPS[Math.floor(Math.random() * RESULT_CODE_GROUPS.length)]
        return randomGroup[Math.floor(Math.random() * randomGroup.length)]
      }

      result.CJSresultCode = getRandomResultCode()

      const isSSOCode = SUSPENDED_SENTENCE_ORDER_RESULT_CODES.includes(result.CJSresultCode)

      if (isSSOCode) {
        const VALID_UNITS = ["Y", "M", "W", "D", "H"] as const
        type ValidUnit = (typeof VALID_UNITS)[number]

        const UNIT_MAX_BOUNDS: Record<ValidUnit, number> = {
          Y: 2,
          M: 24,
          W: 104,
          D: 730,
          H: 17520
        }

        function getRandomDuration(type: "Duration" | "Suspended") {
          const randomUnit = VALID_UNITS[Math.floor(Math.random() * VALID_UNITS.length)]
          const maxBound = UNIT_MAX_BOUNDS[randomUnit]

          const randomLength = Math.floor(Math.random() * maxBound) + 1

          return {
            DurationLength: randomLength,
            DurationUnit: randomUnit,
            DurationType: type
          }
        }

        const custodialDuration = getRandomDuration("Duration")
        const suspendedDuration = getRandomDuration("Suspended")

        result.Duration = [custodialDuration, suspendedDuration]
      }
    })
  })
}

export default communitySentenceAmendResultCodes
