import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000340RENQASIPNCA05A73000017300000120210901140973000001                                             050002362</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/24V     BREACHPLEANO            </IDS>
        <CCR>K21/2732/19C                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
        <COF>K002    5:5:5:1      TH68006 01102010                </COF>
      </ASI>
      <GMT>000009073ENQR000340R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
      courtCaseReference: "21/2732/000019C",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["OTHEROFFENCES"],
        defendantLastName: "BREACHPLEANOVERDICT"
      },
      carryForward: {
        appearanceDate: "2011-10-28",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ03510",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "425857c9-1b58-4306-a65e-5709570cdcd1"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4027,
              disposalEffectiveDate: "2011-10-28"
            }
          ],
          offenceId: "11c016fc-1850-4074-a5fb-6ff00109ad66"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      arrestSummonsNumber: "13/01ZD/01/449641X",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
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
      <GMH>073ENQR000341RENQASIPNCA05A73000017300000120210901140973000001                                             050002365</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/24V     BREACHPLEANO            </IDS>
        <CCR>K21/2732/27L                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
        <CCR>K21/2732/19C                   </CCR>
        <COF>K001    5:5:5:1      TH68006 01102010                </COF>
        <ADJ>INOT GUILTY   GUILTY        261020110000 </ADJ>
        <DIS>I4027    28102011                                                                                        </DIS>
      </ASI>
      <GMT>000012073ENQR000341R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      arrestSummonsNumber: "13/01ZD/01/449641X",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
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
      <GMH>073ENQR000342RENQASIPNCA05A73000017300000120210901140973000001                                             050002367</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/24V     BREACHPLEANO            </IDS>
        <CCR>K21/2732/27L                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
        <CCR>K21/2732/19C                   </CCR>
        <COF>K001    5:5:5:1      TH68006 01102010                </COF>
        <ADJ>INOT GUILTY   GUILTY        261020110000 </ADJ>
        <DIS>I4027    28102011                                                                                        </DIS>
      </ASI><GMT>000012073ENQR000342R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-3.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
      courtCaseReference: "21/2732/000027L",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-11-28",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["OTHEROFFENCES"],
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
          offenceId: "5284d8f8-c797-4b82-9a65-3814e7be5c0b"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
      courtCaseReference: "21/2732/000019C",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-11-28",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 200
              }
            }
          ],
          offenceId: "69f0d503-a12c-493c-b6ee-a2cfeb0c7163"
        }
      ]
    },
    count: 1
  })
]
