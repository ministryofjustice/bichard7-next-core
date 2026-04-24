import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000300RENQASIPNCA05A73000017300000120210901124073000001                                             050002276</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/3X      HOMER                   </IDS>
        <CCR>K21/2732/3K                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <COF>K002    12:15:13:1   RT88191 28112010                </COF>
      </ASI>
      <GMT>000009073ENQR000300R</GMT>
    </CXE01>`,
    expectedRequest: "",
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "HOMER",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/3X",
      courtCaseReference: "21/2732/000003K",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["HOMER"],
        defendantLastName: "WELLS"
      },
      carryForward: {
        appearanceDate: "2011-10-08",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2051
            }
          ],
          offenceId: "abe1be67-91bf-4f2f-9c2b-60b06d84f6b1"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "RT88191",
          plea: "NOT GUILTY",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "17f6da71-340d-4cf6-a08e-ae7c48bdc641"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "HOMER",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410785P",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/3X",
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
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000301RENQASIPNCA05A73000017300000120210901124073000001                                             050002279</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/3X      HOMER                   </IDS>
        <CCR>K21/2732/3K                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    260920110000 </ADJ>
        <DIS>I2051                                                                                                    </DIS>
        <CCR>K21/2732/25J                   </CCR>
        <COF>K001    12:15:13:1   RT88191 28112010                </COF>
      </ASI>
      <GMT>000012073ENQR000301R</GMT>
    </CXE01>`,
    expectedRequest: "",
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "HOMER",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/3X",
      courtCaseReference: "21/2732/000025J",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-08",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["HOMER"],
        defendantLastName: "WELLS"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-08",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "695467c9-6a37-4daa-bd16-e93f54e4ef8d"
        }
      ]
    },
    count: 1
  })
]
