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

  const bailConditions = (
    Array.isArray(pncJson.bailConditions) ? pncJson.bailConditions : [pncJson.bailConditions]
  ).flatMap((bailCondition) => bailCondition.match(/.{1,50}/g) ?? [])

  // TEMP: Remove before PR approval
  const result = mapToRemandRequest(
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

  return {
    ...result,
    crimeOffenceReferenceNo: pncJson.crimeOffenceReferenceNo,
    remandResult: pncJson.remandResult,
    remandLocationFfss: pncJson.remandLocationFfss,
    personUrn: pncJson.pncIdentifier
  }
  // TEMP: Remove before PR approval

  // TEMP: Uncomment before PR approval
  // return mapToRemandRequest(
  //   {
  //     ...pncJson,
  //     personUrn: pncJson.pncIdentifier,
  //     hearingDate: pncJson.remandDate,
  //     pncRemandStatus: pncJson.remandResult,
  //     bailConditions,
  //     nextHearingDate: pncJson.nextAppearanceDate,
  //     psaCourtCode: pncJson.nextAppearanceLocation
  //   },
  //   pncUpdateDataset
  // )
}
