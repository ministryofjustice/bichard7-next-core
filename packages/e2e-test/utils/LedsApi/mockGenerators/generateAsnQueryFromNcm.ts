import Asn from "@moj-bichard7/core/lib/Asn"
import type { AsnQueryRequest } from "@moj-bichard7/core/types/leds/AsnQueryRequest"
import type {
  AsnQueryResponse,
  Offence as AsnQueryResponseOffence
} from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import { HttpStatusCode } from "axios"
import { randomUUID } from "crypto"
import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import type { LedsBichard, LedsMock, LedsMockOptions } from "../../../types/LedsMock"
import type ParsedNcm from "../../../types/ParsedNcm"
import { extractAllTags, replaceAllTags } from "../../tagProcessing"
import createMockRequest from "./createMockRequest"
import createMockResponse from "./createMockResponse"

const parser = new XMLParser()

const generateRequestBody = (ncm: ParsedNcm): AsnQueryRequest => {
  return {
    asn: new Asn(ncm.NewCaseMessage.Case.Defendant.ProsecutorReference).toPncFormat(),
    caseStatusMarkers: ["impending-prosecution-detail", "penalty-notice", "court-case"]
  }
}

const mapOffences = (ncm: ParsedNcm): AsnQueryResponseOffence[] => {
  const offenceObject = ncm.NewCaseMessage.Case.Defendant.Offence
  const offences = Array.isArray(offenceObject) ? offenceObject : [offenceObject]

  return offences.map((offence) => ({
    offenceId: randomUUID(),
    courtOffenceSequenceNumber: offence.BaseOffenceDetails.OffenceSequenceNumber,
    cjsOffenceCode: offence.BaseOffenceDetails.OffenceCode,
    offenceStartDate: offence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartDate,
    offenceEndDate: offence.BaseOffenceDetails.OffenceTiming.OffenceEnd?.OffenceEndDate,
    offenceDescription: [offence.BaseOffenceDetails.OffenceWording],
    plea: "Not Known",
    adjudications: [],
    disposalResults: []
  }))
}

const generateResponseBody = (ncm: ParsedNcm): AsnQueryResponse => {
  const asn = ncm.NewCaseMessage.Case.Defendant.ProsecutorReference
  const forceStationCode = ncm.NewCaseMessage.Case.PTIURN.substring(0, 4)

  return {
    personId: randomUUID(),
    personUrn: "2000/0410769X",
    reportId: randomUUID(),
    asn,
    ownerCode: forceStationCode,
    disposals: [
      {
        courtCaseId: randomUUID(),
        courtCaseReference: "97/1626/008395Q",
        caseStatusMarker: "impending-prosecution-detail",
        court: {
          courtIdentityType: "code",
          courtCode: ncm.NewCaseMessage.Case.InitialHearing.CourtHearingLocation
        },
        offences: mapOffences(ncm)
      }
    ]
  }
}

const generateAsnQueryFromNcm = (bichard: LedsBichard, ncmFile: string, options?: LedsMockOptions): LedsMock => {
  let xmlData = fs.readFileSync(ncmFile, "utf8").toString()
  extractAllTags(bichard, xmlData)
  if (bichard.config.parallel) {
    xmlData = replaceAllTags(bichard, xmlData)
  }

  const ncm = parser.parse(xmlData) as ParsedNcm
  const request = createMockRequest({
    path: "/find-disposals-by-asn",
    exactBodyMatch: true,
    body: generateRequestBody(ncm)
  })

  const response = createMockResponse(generateResponseBody(ncm), HttpStatusCode.Ok)

  return {
    id: randomUUID(),
    request,
    response,
    count: options?.count,
    receivedRequests: []
  }
}

export default generateAsnQueryFromNcm
