import { randomUUID } from "crypto"

export default () => [
  {
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
          asn: "11/01ZD/01/411380L",
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
          personUrn: "21/12G",
          reportId: randomUUID(),
          asn: "1101ZD0100000411380L",
          ownerCode: "01ZD",
          disposals: [
            {
              courtCaseId: randomUUID(),
              courtCaseReference: "21/2732/8Q",
              caseStatusMarker: "impending-prosecution-detail",
              court: {
                courtIdentityType: "code",
                courtCode: "B01EF01"
              },
              offences: [
                {
                  offenceId: randomUUID(),
                  courtOffenceSequenceNumber: 1,
                  cjsOffenceCode: "TH68010",
                  offenceStartDate: "2010-09-25",
                  offenceDescription: ["Some description"],
                  plea: "Not Guilty",
                  adjudications: [
                    {
                      adjudicationId: randomUUID(),
                      appearanceNumber: 0,
                      disposalDate: "2011-10-01",
                      adjudication: "Guilty"
                    }
                  ],
                  disposalResults: [
                    {
                      disposalId: randomUUID(),
                      disposalCode: 1002,
                      disposalDuration: {
                        units: "months",
                        count: 12
                      }
                    }
                  ]
                }
              ]
            },
            {
              courtCaseId: randomUUID(),
              courtCaseReference: "21/2732/25J",
              caseStatusMarker: "impending-prosecution-detail",
              court: {
                courtIdentityType: "code",
                courtCode: "B01EF01"
              },
              offences: [
                {
                  offenceId: randomUUID(),
                  courtOffenceSequenceNumber: 1,
                  cjsOffenceCode: "TH68151",
                  offenceStartDate: "2010-09-25",
                  offenceDescription: ["Some description"],
                  plea: "Not Guilty",
                  adjudications: [],
                  disposalResults: []
                }
              ]
            }
          ]
        }
      }
    }
  }
]
