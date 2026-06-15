import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "COMMUNITYORD",
      croNumber: "",
      gmh: "073ENQR000711RENQASIPNCA05A73000017300000120210903102373000001                                             050002914",
      gmt: "000008073ENQR000711R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/16L",
      reportId: SET_BY_PROCESSOR,
      asn: "1101VK0100000376290V",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2812/000005J",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:1:1:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68023",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-10-01",
              offenceId: "ecaaada5-be15-4f68-992b-f61c45f80299",
              disposalResults: []
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "COMMUNITYORD",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/16L",
      courtCaseReference: "21/2812/000005J",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BREACH"],
        defendantLastName: "COMMUNITYORDERTWO"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68023",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 3
              }
            }
          ],
          offenceId: "434797ae-dc50-4581-8bbb-e61a808cc4d3"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "11/01VK/01/376290V",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "CJ03511"
              },
              committedOnBail: false,
              plea: "Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2009-10-26",
              offenceTic: 0,
              offenceStartDate: "2009-10-01",
              disposalResults: [
                {
                  disposalCode: 1029
                }
              ],
              locationFsCode: "01VK",
              locationText: {
                locationText: "KINGSTON HIGH STREET"
              }
            }
          ]
        }
      ]
    },
    count: 1
  })
]
