import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "TWICEBREACHE",
      croNumber: "",
      gmh: "073ENQR000728RENQASIPNCA05A73000017300000120210903102773000001                                             050002951",
      gmt: "000008073ENQR000728R",
      personId: SET_BY_PROCESSOR,
      personUrn: "21/23U",
      reportId: SET_BY_PROCESSOR,
      asn: "1401ZD0100000449846U",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000017A",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "8:7:69:3",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "CJ03510",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-10-01",
              offenceId: "772408de-e72a-4083-ae21-e034204de8e7",
              disposalResults: []
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "TWICEBREACHE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/23U",
      courtCaseReference: "21/2732/000017A",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ASNREUSED"],
        defendantLastName: "TWICEBREACHED"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ03510",
          plea: "No Plea Taken",
          adjudication: "Not Guilty",
          dateOfSentence: "2009-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2006
            }
          ],
          offenceId: "6e7dd434-450d-435e-b163-14f13e0830fe"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "TWICEBREACHE",
      croNumber: "",
      gmh: "073ENQR000729RENQASIPNCA05A73000017300000120210903102773000001                                             050002953",
      gmt: "000010073ENQR000729R",
      personId: SET_BY_PROCESSOR,
      personUrn: "21/23U",
      reportId: SET_BY_PROCESSOR,
      asn: "1401ZD0100000449846U",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000017A",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "8:7:69:3",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "CJ03510",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "No Plea Taken",
              offenceTic: 0,
              offenceStartDate: "2009-10-01",
              offenceId: "c9b405fa-a4f9-421f-8bc5-205ed9721d21",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "eef3deea-a133-49c2-8ccf-d42386666cfa",
                  disposalDate: "2009-10-26",
                  adjudication: "Not Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "e249f3d8-86c8-4a6f-a4e7-5d37ae9f0527",
                  disposalCode: 2006,
                  disposalText: ""
                }
              ]
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 2
  })
]
