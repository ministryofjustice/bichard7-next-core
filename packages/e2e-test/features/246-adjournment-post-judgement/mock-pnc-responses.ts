import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "ADDOFFAPJNOP",
      croNumber: "",
      gmh: "073ENQR000333RENQASIPNCA05A73000017300000120210901140473000001                                             050002346",
      gmt: "000009073ENQR000333R",
      personId: SET_BY_PROCESSOR,
      personUrn: "21/21R",
      reportId: SET_BY_PROCESSOR,
      asn: "1201ZD0100000445746P",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000016Z",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68006",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "6caa07ea-64b1-4f8e-a6f9-5b21912d2765",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:7:11:10",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68151",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "3fb42395-58ad-4259-8d0c-d711c32b2b87",
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
      pncCheckName: "ADDOFFAPJNOP",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/21R",
      courtCaseReference: "21/2732/000016Z",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NOEXCEPTION"],
        defendantLastName: "ADDOFFAPJNOPNCADJ"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4047,
              disposalEffectiveDate: "2011-10-26"
            }
          ],
          offenceId: "61c1516d-56df-4824-a347-07df30f6902a"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4047,
              disposalEffectiveDate: "2011-10-26"
            }
          ],
          offenceId: "4760a2e1-240a-4893-88b3-c6d7e783d8b9"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "ADDOFFAPJNOP",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/445746P",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/21R",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-26",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "ADDOFFAPJNOP",
      croNumber: "",
      gmh: "073ENQR000334RENQASIPNCA05A73000017300000120210901140473000001                                             050002349",
      gmt: "000013073ENQR000334R",
      personId: SET_BY_PROCESSOR,
      personUrn: "21/21R",
      reportId: SET_BY_PROCESSOR,
      asn: "1201ZD0100000445746P",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000016Z",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68006",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "a636bffb-622a-4f6b-b993-9f37ffc1bc49",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "5327dc2f-f4f2-441e-acfb-96374e12042a",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "d0a40c69-9ee4-47a2-915c-0ac2093bf82b",
                  disposalCode: 4047,
                  disposalEffectiveDate: "2011-10-26",
                  disposalText: ""
                }
              ]
            },
            {
              acpoOffenceCode: "5:7:11:10",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68151",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "a7d4e4d9-2ebf-4363-8f0c-9c1e28561c16",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "4680752c-a50d-4ad7-8b24-f71742dc3532",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "f7f64723-8f27-47de-ae63-0525a5fb686f",
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
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "ADDOFFAPJNOP",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/445746P",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/21R",
      remandDate: "2011-10-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-11-26",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
