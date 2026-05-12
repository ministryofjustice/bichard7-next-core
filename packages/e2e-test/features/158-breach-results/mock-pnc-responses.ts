import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "DDDRAVEN",
      croNumber: "",
      gmh: "073ENQR000320RENQASIPNCA05A73000017300000120210901130373000001                                             050002317",
      gmt: "000009073ENQR000320R",
      personId: SET_BY_PROCESSOR,
      personUrn: "21/13H",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410821D",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000010T",
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
              offenceStartDate: "2010-10-01",
              offenceId: "19d8fd85-9e6c-4f67-8e30-8118fcf2cd24",
              disposalResults: []
            },
            {
              acpoOffenceCode: "8:7:69:3",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "CJ03510",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-10-01",
              offenceId: "cdb958f7-a43a-49bd-a00a-2dba897675aa",
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
      pncCheckName: "DDDRAVEN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/13H",
      courtCaseReference: "21/2732/000010T",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-21",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ALEX"],
        defendantLastName: "DDDRAVEN"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ03510",
          plea: "No Plea Taken",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-21",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2011-10-28"
            }
          ],
          offenceId: "39e6fb23-2d2b-4314-a9ab-5a4ffc9c74fa"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "CJ03510",
          plea: "No Plea Taken",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-21",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2011-10-28"
            }
          ],
          offenceId: "86512839-11d7-4077-83c5-b7524a1172bc"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "DDDRAVEN",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410821D",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/13H",
      remandDate: "2011-10-21",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-28",
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
      pncCheckName: "DDDRAVEN",
      croNumber: "",
      gmh: "073ENQR000321RENQASIPNCA05A73000017300000120210901130373000001                                             050002320",
      gmt: "000013073ENQR000321R",
      personId: SET_BY_PROCESSOR,
      personUrn: "21/13H",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410821D",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000010T",
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
              offenceStartDate: "2010-10-01",
              offenceId: "dc7607f0-e8fb-4082-b81f-1239553adf69",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "d1d23803-4b51-41d1-aa60-193fa1ffb97d",
                  disposalDate: "2011-10-21",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "f9a3a779-3b17-48dd-8051-bf54a963060c",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2011-10-28",
                  disposalText: ""
                }
              ]
            },
            {
              acpoOffenceCode: "8:7:69:3",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "CJ03510",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "No Plea Taken",
              offenceTic: 0,
              offenceStartDate: "2010-10-01",
              offenceId: "24d5b6d2-18aa-4c53-bdf8-0b0778e14dd9",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "8dd6aa8f-3e94-418a-b2f8-a07682fd5847",
                  disposalDate: "2011-10-21",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "1472ddb9-1ccf-48e8-bf09-e4ea4cfb84bb",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2011-10-28",
                  disposalText: ""
                }
              ]
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: ""
  })
]
