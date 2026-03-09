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

  return mapToRemandRequest(
    {
      ...pncJson,
      hearingDate: pncJson.remandDate,
      pncRemandStatus: pncJson.remandResult,
      bailConditions: pncJson.bailConditions.split(" ").filter(Boolean) ?? [],
      nextHearingDate: pncJson.nextAppearanceDate,
      psaCourtCode: pncJson.institutionCode
    },
    pncUpdateDataset
  )
}
