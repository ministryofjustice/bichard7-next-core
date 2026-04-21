import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000314RENQASIPNCA05A73000017300000120210901125773000001                                             050002305</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/12G     SENDEFNEWREM            </IDS>
        <CCR>K21/2812/2F                    </CCR>
        <COF>K001    5:5:5:1      TH68006 01092010                </COF>
        <COF>K002    5:7:11:10    TH68151 01092010                </COF>
        <COF>K003    5:5:8:1      TH68010 01092010                </COF>
      </ASI>
      <GMT>000010073ENQR000314R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "SENDEFNEWREM",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/12G",
      courtCaseReference: "21/2812/000002F",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2010-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ONECCR"],
        defendantLastName: "SENDEFNEWREM"
      },
      carryForward: {
        appearanceDate: "2010-10-26",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "79747853-b658-408c-8266-0946ae0f6418"
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
          offenceId: "9809a5cb-d6c9-4761-a33e-d7b78186e60b"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "TH68010",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "d2984de5-777f-4b84-8902-7669f985b2b7"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "SENDEFNEWREM",
      croNumber: "",
      arrestSummonsNumber: "11/01VK/01/376483E",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/12G",
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
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000315RENQASIPNCA05A73000017300000120210901125773000001                                             050002308</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/12G     SENDEFNEWREM            </IDS>
        <CCR>K21/2732/26K                   </CCR>
        <COF>K001    5:5:5:1      TH68006 01092010                </COF>
        <COF>K002    5:5:8:1      TH68010 01092010                </COF>
        <CCR>K21/2812/2F                    </CCR>
        <COF>K001    5:7:11:10    TH68151 01092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ>
        <DIS>I4011    26102010                                                                                        </DIS>
      </ASI>
      <GMT>000013073ENQR000315R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "SENDEFNEWREM",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/12G",
      courtCaseReference: "21/2812/000002F",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2010-10-26",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
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
          offenceId: "e8dc05e8-5874-40e1-9b7d-d90ddf18a9be"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "SENDEFNEWREM",
      croNumber: "",
      arrestSummonsNumber: "11/01VK/01/376483E",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/12G",
      remandDate: "2010-10-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2010-11-26",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
