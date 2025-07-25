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
          asn: "12/01ZD/01/448696W",
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
          asn: "1201ZD0100000448696W",
          ownerCode: "01ZD",
          disposals: [
            {
              courtCaseId: randomUUID(),
              courtCaseReference: "21/2732/000004L",
              caseStatusMarker: "impending-prosecution-detail",
              court: {
                courtIdentityType: "code",
                courtCode: "B01EF01"
              },
              offences: [
                {
                  offenceId: randomUUID(),
                  courtOffenceSequenceNumber: 1,
                  cjsOffenceCode: "RT88007",
                  offenceStartDate: "2010-11-28",
                  offenceDescription: ["Some description"],
                  plea: "Not Guilty",
                  adjudications: [
                    {
                      adjudicationId: randomUUID(),
                      appearanceNumber: 0,
                      disposalDate: "2011-09-26",
                      adjudication: "Guilty"
                    }
                  ],
                  disposalResults: [
                    { disposalId: randomUUID(), disposalCode: 3096 },
                    { disposalId: randomUUID(), disposalCode: 4047 }
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  }
]
