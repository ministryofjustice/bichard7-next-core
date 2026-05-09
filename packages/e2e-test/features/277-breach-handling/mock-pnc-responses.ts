import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      gmh: "073ENQR000337RENQASIPNCA05A73000017300000120210901140773000001                                             050002356",
      gmt: "000008073ENQR000337R",
      personId: "a431eb88-d480-4204-84aa-e38d2bc94a39",
      personUrn: "21/23U",
      reportId: "07803097-c658-4769-8e50-74fc1a4bb987",
      asn: "1301ZD0100000449640W",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "8cde4ccf-07a1-44ed-bef1-68f461a1460a",
          courtCaseReference: "21/2732/000018B",
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
              offenceId: "50caccf5-9445-4444-9c94-30a556716d41",
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
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      arrestSummonsNumber: "13/01ZD/01/449640W",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/23U",
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
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      gmh: "073ENQR000338RENQASIPNCA05A73000017300000120210901140773000001                                             050002358",
      gmt: "000008073ENQR000338R",
      personId: "2e356b1f-b67e-4102-8e64-55f95aea85c6",
      personUrn: "21/23U",
      reportId: "be25774a-a88b-4c77-809e-5e0dce41d3e3",
      asn: "1301ZD0100000449640W",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "c097fa2c-2886-4b0b-ae1b-b4c640e1e75f",
          courtCaseReference: "21/2732/000018B",
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
              offenceId: "32d21d49-dfc9-491f-97be-1878183e671d",
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
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      arrestSummonsNumber: "13/01ZD/01/449640W",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/23U",
      remandDate: "2011-10-28",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-11-28",
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
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      gmh: "073ENQR000339RENQASIPNCA05A73000017300000120210901140773000001                                             050002360",
      gmt: "000008073ENQR000339R",
      personId: "642e7419-b7f5-45ed-b139-7889f29a4a3f",
      personUrn: "21/23U",
      reportId: "78ce0000-835a-4670-9066-b9e189222065",
      asn: "1301ZD0100000449640W",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "63a265a3-8093-44f0-8137-7424de331e20",
          courtCaseReference: "21/2732/000018B",
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
              offenceId: "dffb59bd-a0a6-4798-9a47-13e3348eea36",
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
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/23U",
      courtCaseReference: "21/2732/000018B",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-11-28",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["STANDALONE"],
        defendantLastName: "BREACHPLEANOVERDICT"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ03510",
          plea: "Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-11-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1030
            }
          ],
          offenceId: "a09e5ea4-844f-4657-b668-6cde87093c4c"
        }
      ]
    },
    count: 1
  })
]
