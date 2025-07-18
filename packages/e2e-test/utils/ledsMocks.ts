import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import { extractAllTags, replaceAllTags } from "./tagProcessing"
import type Bichard from "./world"
import { randomUUID } from "crypto"
import Asn from "@moj-bichard7/core/lib/Asn"
import type { ParsedNCM } from "./pncMocks"

const parser = new XMLParser()

export const mockEnquiryFromNCM = (ncmFile: string, world: Bichard) => {
  let xmlData = fs.readFileSync(ncmFile, "utf8").toString()
  extractAllTags(world, xmlData)
  if (world.config.parallel) {
    xmlData = replaceAllTags(world, xmlData)
  }

  const parsed = parser.parse(xmlData) as ParsedNCM
  const prosecutorRef = parsed.NewCaseMessage.Case.Defendant.ProsecutorReference
  const offenceEl = parsed.NewCaseMessage.Case.Defendant.Offence
  const offenceData = Array.isArray(offenceEl) ? offenceEl : [offenceEl]
  const offences = offenceData.map((offence) => ({
    code: offence.BaseOffenceDetails.OffenceCode.padEnd(8, " "),
    sequenceNo: offence.BaseOffenceDetails.OffenceSequenceNumber.toString().padStart(3, "0"),
    description: offence.BaseOffenceDetails.OffenceWording,
    startDate: offence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartDate,
    endDate:
      offence.BaseOffenceDetails.OffenceTiming.OffenceEnd &&
      offence.BaseOffenceDetails.OffenceTiming.OffenceEnd.OffenceEndDate
        ? offence.BaseOffenceDetails.OffenceTiming.OffenceEnd.OffenceEndDate
        : undefined
  }))
  const forceStationCode = parsed.NewCaseMessage.Case.PTIURN.substring(0, 4)
  const asn = new Asn(prosecutorRef).toPncFormat()

  return {
    httpRequest: {
      method: "POST",
      path: "/find-disposals-by-asn",
      headers: {
        Accept: "application/json",
        "X-Leds-Correlation-Id": [".*"]
      },
      body: {
        type: "JSON",
        json: {
          asn,
          caseStatusMarkers: ["impending-prosecution-detail", "penalty-notice", "result-unobtainable", "court-case"]
        },
        matchType: "STRICT"
      }
    },
    httpResponse: {
      statusCode: 200,
      body: {
        type: "JSON",
        json: {
          personId: randomUUID(),
          reportId: randomUUID(),
          asn: prosecutorRef,
          ownerCode: forceStationCode,
          disposals: [
            {
              courtCaseId: randomUUID(),
              courtCaseReference: "97/1626/008395Q",
              caseStatusMarker: "impending-prosecution-detail",
              court: {
                courtIdentityType: "code",
                courtCode: parsed.NewCaseMessage.Case.InitialHearing.CourtHearingLocation
              },
              offences: offences.map((offence) => ({
                offenceId: randomUUID(),
                courtOffenceSequenceNumber: offence.sequenceNo,
                cjsOffenceCode: offence.code.trim(),
                offenceStartDate: offence.startDate,
                offenceEndDate: offence.endDate,
                offenceDescription: [offence.description],
                adjudications: [],
                disposalResults: []
              }))
            }
          ]
        }
      }
    }
  }
}
