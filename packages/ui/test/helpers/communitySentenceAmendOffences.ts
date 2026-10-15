import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const SUSPENDED_SENTENCE_ORDER_RESULT_CODES = [1115, 1134, 1508, 1507]
const OTHER_SENTENCING_ACT_RESULT_CODES = [1030, 1032, 4575, 4576, 4577]
const OTHER_RESULT_CODES = [3078, 3052]

// Updates result codes and duration (where applicable) to create dummy data specific to community sentences
const communitySentenceAmendOffences = (aho: AnnotatedHearingOutcome) => {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence) => {
    offence.Result.forEach((result) => {
      result.PleaStatus = Math.random() > 0.5 ? "G" : "NG"

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

        const UNIT_MIN_BOUNDS: Record<ValidUnit, number> = {
          Y: 1,
          M: 1,
          W: 4,
          D: 30,
          H: 720
        }

        const getRandomDuration = (type: "Duration" | "Suspended") => {
          const randomUnit = VALID_UNITS[Math.floor(Math.random() * VALID_UNITS.length)]
          const maxBound = UNIT_MAX_BOUNDS[randomUnit]
          const minBound = UNIT_MIN_BOUNDS[randomUnit]

          const randomLength = Math.floor(Math.random() * (maxBound - minBound + 1)) + minBound

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

export default communitySentenceAmendOffences
