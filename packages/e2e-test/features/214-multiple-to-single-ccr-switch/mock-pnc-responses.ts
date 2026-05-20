import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "TOSINGLECCR",
      croNumber: "",
      gmh: "073ENQR000491RENQASIPNCA05A73000017300000120210908114273000001                                             050002399",
      gmt: "000010073ENQR000491R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2012/29N",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000440776N",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "13/2732/000003W",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:8:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2011-09-25",
              offenceId: "83f85bb4-0d78-492d-8d18-9815f7d21336",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "13/2732/000004X",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "1:8:11:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "CJ88001",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2011-09-25",
              offenceId: "e5951e85-2ab9-41bb-a54c-9ef2cadd7e7d",
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
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "TOSINGLECCR",
      croNumber: "",
      gmh: "073ENQR000492RENQASIPNCA05A73000017300000120210908114373000001                                             050002400",
      gmt: "000009073ENQR000492R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/4Y",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000440776N",
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
              acpoOffenceCode: "5:5:8:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2011-09-25",
              offenceId: "3491f6bd-bcf0-43e5-bdea-13186a578643",
              disposalResults: []
            },
            {
              acpoOffenceCode: "1:8:11:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "CJ88001",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2011-09-25",
              offenceId: "893b4423-14a2-434f-aa92-771c92cd199a",
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
      pncCheckName: "TOSINGLECCR",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2021/4Y",
      courtCaseReference: "21/2732/000004L",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-11-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MULTIPLECCR"],
        defendantLastName: "TOSINGLECCRX"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-11-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 3025,
              disposalDuration: {
                units: "life",
                count: 0
              },
              disposalText: "SEA MONKEY"
            }
          ],
          offenceId: "f1f981ad-1d56-4007-b2c9-9653772c2be3"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "CJ88001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-11-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 14
              }
            },
            {
              disposalCode: 3107
            }
          ],
          offenceId: "4c639fe7-2b42-499f-863b-3ac3a93670a6"
        }
      ]
    }
  })
]
