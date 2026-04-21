import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000704RENQASIPNCA05A73000017300000120210903102273000001                                             050002898</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/12G     BUELLER                 </IDS>
        <CCR>K21/2732/8Q                    </CCR>
        <COF>K001    5:5:8:1      TH68010 25092010                </COF>
        <COF>K002    5:7:11:10    TH68151 25092010                </COF>
      </ASI>
      <GMT>000009073ENQR000704R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "BUELLER",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/12G",
      courtCaseReference: "21/2732/000008Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["PAUL"],
        defendantLastName: "BUELLER"
      },
      carryForward: {
        appearanceDate: "2012-02-01",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-01",
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
          offenceId: "5d7cfcce-8e15-4045-9ea0-e403e58e90e8"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "229144af-0e24-452d-bb8d-2f77baf889f8"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "BUELLER",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/411380L",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/12G",
      remandDate: "2011-10-01",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2012-02-01",
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
      <GMH>073ENQR000705RENQASIPNCA05A73000017300000120210903102273000001                                             050002901</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/12G     BUELLER                 </IDS>
        <CCR>K21/2732/8Q                    </CCR>
        <COF>K001    5:5:8:1      TH68010 25092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ>
        <DIS>I1002M12                                                                                                 </DIS>
        <CCR>K21/2732/25J                   </CCR>
        <COF>K001    5:7:11:10    TH68151 25092010                </COF>
      </ASI>
      <GMT>000012073ENQR000705R</GMT>
    </CXE01>
    `,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "BUELLER",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/12G",
      courtCaseReference: "21/2732/000025J",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2012-02-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["PAUL"],
        defendantLastName: "BUELLER"
      },
      carryForward: {
        appearanceDate: "2012-03-02",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68151",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "7ccf2623-eb2a-474f-8ff4-118f92bc19a0"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "11/01ZD/01/411380L",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68006"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2012-02-01",
              offenceTic: 0,
              offenceStartDate: "2010-09-26",
              disposalResults: [
                {
                  disposalCode: 1002,
                  disposalDuration: {
                    units: "months",
                    count: 13
                  }
                }
              ],
              locationFsCode: "01ZD",
              locationText: {
                locationText: "1 KINGSTON HIGH STREET"
              }
            }
          ]
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "BUELLER",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/411380L",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/12G",
      remandDate: "2012-02-01",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2012-03-02",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
