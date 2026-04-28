import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000337RENQASIPNCA05A73000017300000120210901140773000001                                             050002356</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/23U     BREACHPLEANO            </IDS>
        <CCR>K21/2732/18B                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
      </ASI>
      <GMT>000008073ENQR000337R</GMT>
    </CXE01>`,
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
      remandResult: "B",
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
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000338RENQASIPNCA05A73000017300000120210901140773000001                                             050002358</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/23U     BREACHPLEANO            </IDS>
        <CCR>K21/2732/18B                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
      </ASI>
      <GMT>000008073ENQR000338R</GMT>
    </CXE01>`,
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
      remandResult: "B",
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
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000339RENQASIPNCA05A73000017300000120210901140773000001                                             050002360</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/23U     BREACHPLEANO            </IDS>
        <CCR>K21/2732/18B                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
      </ASI>
      <GMT>000008073ENQR000339R</GMT>
    </CXE01>`,
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
