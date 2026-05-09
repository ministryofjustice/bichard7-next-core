import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "LANCASTER",
      croNumber: "",
      gmh: "073ENQR000136RENQASIPNCA05A73000017300000120210831091373000001                                             050001959",
      gmt: "000011073ENQR000136R",
      personId: "f9b1012b-3529-420e-87d0-41f75d9b8027",
      personUrn: "12/16Z",
      reportId: "0ed98495-7499-44c9-a92e-5e314ec8478f",
      asn: "1200000000000000008V",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "fa27d3bd-981e-45e4-8c76-bf3446ff9a97",
          courtCaseReference: "12/2732/000022Z",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "11:6:4:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "PC53001",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "a1bfed32-441c-4428-9ae5-c3277db9197f",
              disposalResults: []
            },
            {
              acpoOffenceCode: "1:9:7:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "OF61016",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "01e55362-bf66-4359-8ba6-049825a432cb",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "fa27d3bd-981e-45e4-8c76-bf3446ff9a97",
          courtCaseReference: "12/2732/000023A",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:2:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68001",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "06a3500f-c22a-499e-a2fd-9729e3734dac",
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
      pncCheckName: "LANCASTER",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "12/16Z",
      courtCaseReference: "12/2732/000022Z",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-10",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "LANCASTER"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "OF61016",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-10",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "13b37732-ab61-4c68-bbee-8567fe198fad"
        },
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "PC53001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-10",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 13
              }
            }
          ],
          offenceId: "c47bd5b3-f1e6-4c80-a6b3-64fc700fade6"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "LANCASTER",
      croNumber: "",
      gmh: "073ENQR000137RENQASIPNCA05A73000017300000120210831091473000001                                             050001961",
      gmt: "000015073ENQR000137R",
      personId: "cf318326-18f3-4960-a202-d9ca2173bae1",
      personUrn: "12/16Z",
      reportId: "7d34f381-9dca-41c4-85a0-0802b42c4853",
      asn: "1200000000000000008V",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "4b2d160d-dc28-4ce0-8edc-d36606313776",
          courtCaseReference: "12/2732/000022Z",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "11:6:4:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "PC53001",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "23ea9e0b-6add-49b4-a113-ce76c277fe0b",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "ee7417ad-6b3c-4328-975a-9dbf4bfb5b67",
                  disposalDate: "2009-10-10",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "ee978e1a-ea0a-4e3d-b044-a619849bc8c0",
                  disposalCode: 1002,
                  disposalDuration: {
                    units: "months",
                    count: 13
                  },
                  disposalText: ""
                }
              ]
            },
            {
              acpoOffenceCode: "1:9:7:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "OF61016",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "455beaa9-55ca-484c-a597-ced04aa88892",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "11317030-9a6e-4bb7-9286-040b9be75ba8",
                  disposalDate: "2009-10-10",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "32d7cc73-17fb-4d04-a5bc-5c127f432cab",
                  disposalCode: 1002,
                  disposalDuration: {
                    units: "months",
                    count: 12
                  },
                  disposalText: ""
                }
              ]
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "4b2d160d-dc28-4ce0-8edc-d36606313776",
          courtCaseReference: "12/2732/000023A",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:2:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68001",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "b9273008-d346-4b5d-b169-0dcbb9abb351",
              disposalResults: []
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "LANCASTER",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "12/16Z",
      courtCaseReference: "12/2732/000023A",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-20",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "LANCASTER"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-20",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 14
              }
            }
          ],
          offenceId: "12d71d51-9ebe-4802-bfc7-54569c2653fd"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "12/0000/00/8V",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68151"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2009-10-20",
              offenceTic: 0,
              offenceStartDate: "2006-11-02",
              disposalResults: [
                {
                  disposalCode: 1002,
                  disposalDuration: {
                    units: "months",
                    count: 14
                  }
                }
              ],
              locationFsCode: "01ZD",
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
