import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "SENDEFOFFENC",
      croNumber: "",
      gmh: "073ENQR000305RENQASIPNCA05A73000017300000120210906105873000001                                             050002182",
      gmt: "000010073ENQR000305R",
      personId: "8b0a4bf2-e914-4203-9a6c-291fcd80eedb",
      personUrn: "21/2W",
      reportId: "487ca1fc-b74d-4591-b636-0fffd8507abb",
      asn: "1101ZD0100000410856R",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "12f99fce-9aad-4687-89ce-ec14803b7777",
          courtCaseReference: "21/2732/000001H",
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
              offenceStartDate: "2010-09-01",
              offenceId: "dc546ad5-286d-43f8-8d8a-a3066691a50d",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:7:11:10",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68151",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-09-01",
              offenceId: "b1b3364f-8bde-438c-8ab1-7cb22acf2b92",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:8:1",
              courtOffenceSequenceNumber: 3,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-09-01",
              offenceId: "02d43e92-c1f6-4e78-8057-8c51a83d703c",
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
      pncCheckName: "SENDEFOFFENC",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/2W",
      courtCaseReference: "21/2732/000001H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2010-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ONECCR"],
        defendantLastName: "SENDEFOFFENCEADDED"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2010-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2010-10-26"
            }
          ],
          offenceId: "9ad85926-d80a-42c7-9c6f-818e6b956e4e"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2010-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2010-10-26"
            }
          ],
          offenceId: "35675860-bf39-460a-8e0f-ac4baa9fa0b6"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2010-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2010-10-26"
            }
          ],
          offenceId: "8df844cb-f9e9-416a-ac88-ea957f061c83"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "SENDEFOFFENC",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410856R",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/2W",
      remandDate: "2010-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2010-10-26",
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
      pncCheckName: "SENDEFOFFENC",
      croNumber: "",
      gmh: "073ENQR000153RENQASIPNCA05A73000017300000120210906105873000001                                             050001962",
      gmt: "000016073ENQR000153R",
      personId: "a5c8e9f3-2bce-47c8-b25d-3f01bacbd2ea",
      personUrn: "21/2W",
      reportId: "d8081e78-5244-48d2-a1e9-f13ff517fa3f",
      asn: "1101ZD0100000410856R",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "fdb47d8c-2005-4358-8eed-c1316b7f0761",
          courtCaseReference: "21/2732/000001H",
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
              offenceStartDate: "2010-09-01",
              offenceId: "c8f38eaf-5b7b-43ca-98b4-9265ded02671",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "dcdc1fba-cf27-4cfe-ad4c-d9d1148ac4cf",
                  disposalDate: "2010-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "8a0904dc-2be2-4f8f-899f-c31196a45060",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2010-10-26",
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
              offenceStartDate: "2010-09-01",
              offenceId: "d20969d9-5985-4397-8209-712d02b4f5f7",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "dc354625-ced2-4ec3-a383-0da57f8a3d29",
                  disposalDate: "2010-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "15ad299c-7510-4b5a-bf80-9288cceda6f0",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2010-10-26",
                  disposalText: ""
                }
              ]
            },
            {
              acpoOffenceCode: "5:5:8:1",
              courtOffenceSequenceNumber: 3,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-09-01",
              offenceId: "3055df90-c2ce-4ad7-8bd3-3f36bc6b7d12",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "0e486913-d8ba-4b17-a8e0-792ca2876aa4",
                  disposalDate: "2010-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "a6953ebf-8351-4d7b-9f94-22781c68eff6",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2010-10-26",
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
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "SENDEFOFFENC",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/2W",
      courtCaseReference: "21/2732/000001H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2010-10-26",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 9
              }
            }
          ],
          offenceId: "3307145a-229f-4609-8788-d05309342a50"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 10
              }
            }
          ],
          offenceId: "7572fc89-3f3f-48c2-9927-01a7bb032364"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "TH68010",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 11
              }
            }
          ],
          offenceId: "1ae4f8b2-139f-427d-af60-fda9fcde32b6"
        }
      ]
    },
    count: 1
  })
]
