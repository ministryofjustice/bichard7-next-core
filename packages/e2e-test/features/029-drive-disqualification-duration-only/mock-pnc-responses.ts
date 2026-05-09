import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "DUFFY",
      croNumber: "",
      gmh: "073ENQR000304RENQASIPNCA05A73000017300000120210901124773000001                                             050002286",
      gmt: "000008073ENQR000304R",
      personId: "c357f49c-b1b0-465e-b348-7b5f15e4ffe2",
      personUrn: "21/5Z",
      reportId: "03f6c685-500c-4a28-b8f4-4b67a20ea34a",
      asn: "1201ZD0100000448697X",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "45f92ba0-3d98-41f8-a8f7-6508e28270d6",
          courtCaseReference: "21/2732/000005M",
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
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "99575537-35fd-4622-9c90-9ffff009f239",
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
      pncCheckName: "DUFFY",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/5Z",
      courtCaseReference: "21/2732/000005M",
      court: {
        courtIdentityType: "code",
        courtCode: "1910"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["PATRICK"],
        defendantLastName: "DUFFY"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RT88007",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 3096
            },
            {
              disposalCode: 4047,
              disposalEffectiveDate: "2011-10-26"
            }
          ],
          offenceId: "e00951de-38a5-4dd7-a2c8-07e7b7d69bee"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "DUFFY",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/448697X",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/5Z",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "1910"
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
      pncCheckName: "DUFFY",
      croNumber: "",
      gmh: "073ENQR000305RENQASIPNCA05A73000017300000120210901124773000001                                             050002289",
      gmt: "000011073ENQR000305R",
      personId: "4f23d52c-cfef-4c7b-ad9f-2cba5cae8801",
      personUrn: "21/5Z",
      reportId: "8abdbec8-677b-4a60-9a81-2f7f70167333",
      asn: "1201ZD0100000448697X",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "e40f9c84-2c7e-4e82-b9f7-c28d3b22c698",
          courtCaseReference: "21/2732/000005M",
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
              offenceId: "7339b415-6dd5-42f9-93a0-f7a89af2c25f",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "1c6212d8-66ef-429e-b5c9-712ce502bb04",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "3b4ae87e-8a64-4dde-abf9-267da0ef8015",
                  disposalCode: 3096,
                  disposalText: ""
                },
                {
                  disposalId: "e3603e54-608e-4216-aed6-25a5605e180c",
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
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "DUFFY",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/5Z",
      courtCaseReference: "21/2732/000005M",
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
              disposalCode: 3071,
              disposalDuration: {
                units: "months",
                count: 18
              }
            }
          ],
          offenceId: "544c1e97-03f6-4bf2-a8ef-3f895beeb166"
        }
      ]
    },
    count: 1
  })
]
