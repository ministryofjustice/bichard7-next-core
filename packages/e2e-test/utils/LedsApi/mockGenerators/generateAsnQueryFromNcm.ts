import convertAsnToLedsFormat from "@moj-bichard7/core/lib/policeGateway/leds/convertAsnToLedsFormat"
import endpoints from "@moj-bichard7/core/lib/policeGateway/leds/endpoints"
import type { AsnQueryRequest } from "@moj-bichard7/core/types/leds/AsnQueryRequest"
import type {
  AsnQueryResponse,
  Offence as AsnQueryResponseOffence
} from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import { HttpStatusCode } from "axios"
import crypto, { randomUUID } from "crypto"
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
    asn: convertAsnToLedsFormat(ncm.NewCaseMessage.Case.Defendant.ProsecutorReference),
    caseStatusMarkers: ["impending-prosecution-detail", "penalty-notice", "court-case"]
  }
}

const mapOffences = (ncm: ParsedNcm, disposalGroup: string): AsnQueryResponseOffence[] => {
  const offenceObject = ncm.NewCaseMessage.Case.Defendant.Offence
  const offences = Array.isArray(offenceObject) ? offenceObject : [offenceObject]

  return offences
    .filter((offence) => (offence.DisposalGroup?.toString() ?? "0") === disposalGroup)
    .map((offence) => ({
      offenceId: randomUUID() as string,
      courtOffenceSequenceNumber: offence.BaseOffenceDetails.OffenceSequenceNumber,
      cjsOffenceCode: offence.BaseOffenceDetails.OffenceCode,
      offenceStartDate: offence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartDate,
      offenceStartTime: offence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartTime,
      offenceEndDate: offence.BaseOffenceDetails.OffenceTiming.OffenceEnd?.OffenceEndDate,
      offenceEndTime: offence.BaseOffenceDetails.OffenceTiming.OffenceEnd?.OffenceEndTime,
      offenceDescription: [offence.BaseOffenceDetails.OffenceWording.substring(0, 54)],
      plea: "Not Known",
      adjudications: [],
      disposalResults: []
    }))
}

const generateResponseBody = (ncm: ParsedNcm, options: LedsMockOptions): AsnQueryResponse => {
  const asn = ncm.NewCaseMessage.Case.Defendant.ProsecutorReference
  const forceStationCode = ncm.NewCaseMessage.Case.PTIURN.substring(0, 4)
  const offences = Array.isArray(ncm.NewCaseMessage.Case.Defendant.Offence)
    ? ncm.NewCaseMessage.Case.Defendant.Offence
    : [ncm.NewCaseMessage.Case.Defendant.Offence]
  const disposalGroups = [...new Set(offences.map((offence) => offence.DisposalGroup?.toString() ?? "0"))]
  let courtCaseIds = options.courtCaseIds
  if (!courtCaseIds) {
    courtCaseIds = disposalGroups.map((disposalGroup) => crypto.createHash("md5").update(disposalGroup).digest("hex"))
  } else if (courtCaseIds.length !== disposalGroups.length) {
    throw new Error("Provided courtCaseIds in the test data do not match the disposal groups in the NCM file")
  }

  return {
    personId: options.personId ?? randomUUID(),
    personUrn: "2000/0410769X",
    reportId: options.reportId ?? randomUUID(),
    asn,
    ownerCode: forceStationCode,
    disposals: disposalGroups.map((disposalGroup, disposalGroupIndex) => ({
      courtCaseId: courtCaseIds[disposalGroupIndex],
      courtCaseReference: `97/1626/${disposalGroup.padStart(2, "0")}8395Q`,
      caseStatusMarker: "impending-prosecution-detail",
      court: {
        courtIdentityType: "code",
        courtCode: "0000"
      },
      offences: mapOffences(ncm, disposalGroup)
    }))
  }
}

export const generateAsnQueryFromNcm = (bichard: LedsBichard, ncmFile: string, options: LedsMockOptions): LedsMock => {
  let xmlData = fs.readFileSync(ncmFile, "utf8").toString()
  extractAllTags(bichard, xmlData)
  if (bichard.config.parallel) {
    xmlData = replaceAllTags(bichard, xmlData)
  }

  const ncm = parser.parse(xmlData) as ParsedNcm
  const request = createMockRequest({
    path: endpoints.asnQuery,
    exactBodyMatch: true,
    body: generateRequestBody(ncm)
  })

  const mockResponse = generateResponseBody(ncm, options)
  const response = createMockResponse(mockResponse, HttpStatusCode.Ok)

  return {
    id: randomUUID(),
    request,
    response,
    count: options?.count
  }
}
