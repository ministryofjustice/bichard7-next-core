import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "THREEZEROFIV",
      croNumber: "",
      gmh: "073ENQR000731RENQASIPNCA05A73000017300000120210903102873000001                                             050002955",
      gmt: "000008073ENQR000731R",
      personId: "325d786c-8b0f-43f7-bc98-e006f8409456",
      personUrn: "21/24V",
      reportId: "38f34345-7183-40df-afb7-6cac61727183",
      asn: "1101ZD0100000500009X",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "b0baa1f8-b1ab-4bc2-b73e-b97a3a0cb4c1",
          courtCaseReference: "21/2732/000018B",
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
              offenceId: "105c6e71-fed0-4fdd-a297-2e3bd8bab6c7",
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
      pncCheckName: "THREEZEROFIV",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
      courtCaseReference: "21/2732/000018B",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ADJPOSTJUDGE"],
        defendantLastName: "THREEZEROFIVETWO"
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
              disposalCode: 4004,
              disposalEffectiveDate: "2011-10-08"
            }
          ],
          offenceId: "9b70ef35-d6c2-4c06-a22c-7f9d044287ed"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "THREEZEROFIV",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/500009X",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-in-custody",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-08",
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
      pncCheckName: "THREEZEROFIV",
      croNumber: "",
      gmh: "073ENQR000732RENQASIPNCA05A73000017300000120210903102873000001                                             050002958",
      gmt: "000010073ENQR000732R",
      personId: "506781f6-7c0a-4219-8853-0d45fbc65887",
      personUrn: "21/24V",
      reportId: "0aed0fb3-a5be-414c-bdef-7f0b2cd33c9c",
      asn: "1101ZD0100000500009X",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "59eeef73-7ea3-4e19-907f-dd02d850df86",
          courtCaseReference: "21/2732/000018B",
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
              offenceId: "eb50ee85-c5cd-4a38-951e-cfccb1df0067",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "7e0ec7b5-f718-42c6-8044-f1f9feb56333",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "7cc8f8e3-2f76-434b-b917-3adca341e10e",
                  disposalCode: 4004,
                  disposalEffectiveDate: "2011-10-08",
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
  })
]
