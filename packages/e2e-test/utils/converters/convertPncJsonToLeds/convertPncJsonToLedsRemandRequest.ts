import mapToRemandRequest from "@moj-bichard7/core/lib/policeGateway/leds/mapToRemandRequest"
import type { RemandRequest } from "@moj-bichard7/core/types/leds/RemandRequest"
import type { PncRemandJson } from "../convertPncXmlToJson/convertPncXmlToJson"

export const convertPncJsonToLedsRemandRequest = (pncJson: PncRemandJson): RemandRequest =>
  mapToRemandRequest({
    ...pncJson,
    hearingDate: pncJson.remandDate,
    pncRemandStatus: pncJson.remandResult,
    bailConditions: pncJson.bailConditions.split(" ").filter(Boolean) ?? [],
    nextHearingDate: pncJson.nextAppearanceDate,
    psaCourtCode: pncJson.nextAppearanceLocation
  })
