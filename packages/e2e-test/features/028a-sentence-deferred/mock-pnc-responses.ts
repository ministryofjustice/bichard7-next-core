import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "JIMBOBJONES",
      croNumber: "",
      gmh: "073ENQR000303RENQASIPNCA05A73000017300000120210901124573000001                                             050002284",
      gmt: "000011073ENQR000303R",
      personId: SET_BY_PROCESSOR,
      personUrn: "21/4Y",
      reportId: SET_BY_PROCESSOR,
      asn: "1201ZD0100000448696w",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000004L",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "12:15:16:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "RT88007",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "14e139d3-c10f-490f-8270-8d557ef47645",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "c9173fa9-21da-42d8-909c-eb51782e50d9",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "77460e5b-63b9-469a-827d-bdaa33d4b7a0",
                  disposalCode: 3096,
                  disposalText: ""
                },
                {
                  disposalId: "573be14a-f4db-4962-bd36-265ad7c1bf9f",
                  disposalCode: 4047,
                  disposalEffectiveDate: "2011-10-26",
                  disposalText: ""
                }
              ]
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "JIMBOBJONES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/4Y",
      courtCaseReference: "21/2732/000004L",
      court: {
        courtIdentityType: "code",
        courtCode: "1910"
      },
      appearanceDate: "2011-10-26",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RT88007",
          disposalResults: [
            {
              disposalCode: 3050
            },
            {
              disposalCode: 3070,
              disposalDuration: {
                units: "months",
                count: 12
              },
              disposalText: "FROM 26/09/11"
            }
          ],
          offenceId: "3f15846a-e6f8-46bd-9a2b-28c5b9922a0a"
        }
      ]
    },
    count: 1
  })
]
