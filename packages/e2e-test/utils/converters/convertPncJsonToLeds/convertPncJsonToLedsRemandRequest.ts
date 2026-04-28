import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import mapToRemandRequest from "@moj-bichard7/core/lib/policeGateway/leds/mapToRemandRequest"
import type { RemandRequest } from "@moj-bichard7/core/types/leds/RemandRequest"
import type { PncRemandJson } from "../convertPncXmlToJson/convertPncXmlToJson"

export const convertPncJsonToLedsRemandRequest = (pncJson: PncRemandJson): RemandRequest => {
  const pncUpdateDataset = {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            PNCIdentifier: ""
          }
        }
      }
    }
  } as PncUpdateDataset

  const bailConditionsArray = (
    Array.isArray(pncJson.bailConditions) ? pncJson.bailConditions : [pncJson.bailConditions]
  ).flatMap((bailCondition) => bailCondition.match(/.{1,50}/g) ?? [])
  const bailConditions = []
  while (bailConditionsArray.length > 0) {
    bailConditions.push(bailConditionsArray.splice(0, 4).join("\n"))
  }

  return mapToRemandRequest(
    {
      ...pncJson,
      hearingDate: pncJson.remandDate,
      pncRemandStatus: pncJson.remandResult,
      bailConditions,
      nextHearingDate: pncJson.nextAppearanceDate,
      psaCourtCode: pncJson.nextAppearanceLocation
    },
    pncUpdateDataset
  )
}
