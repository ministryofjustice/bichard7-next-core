import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000689RENQASIPNCA05A73000017300000120210903101373000001                                             050002864</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/2W      TENENBAUM               </IDS>
        <CCR>K21/2732/2J                    </CCR>
        <COF>K001    1:9:7:2      OF61018 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000689R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "TENENBAUM",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/2W",
      courtCaseReference: "21/2732/000002J",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["CHAS"],
        defendantLastName: "TENENBAUM"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "OF61018",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4027,
              disposalEffectiveDate: "2011-10-01"
            }
          ],
          offenceId: "067f5f42-0cb5-48f2-88d7-44b44b49f6d8"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "TENENBAUM",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410799E",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/2W",
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
        date: "2011-10-01",
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
      <GMH>073ENQR000690RENQASIPNCA05A73000017300000120210903101373000001                                             050002867</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/2W      TENENBAUM               </IDS>
        <CCR>K21/2732/2J                    </CCR>
        <COF>K001    1:9:7:2      OF61018 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4027    01102011                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000690R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "TENENBAUM",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410799E",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/2W",
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
      <GMH>073ENQR000691RENQASIPNCA05A73000017300000120210903101373000001                                             050002869</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/2W      TENENBAUM               </IDS>
        <CCR>K21/2732/2J                    </CCR>
        <COF>K001    1:9:7:2      OF61018 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4027    01102011                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000691R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-3.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "TENENBAUM",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/2W",
      courtCaseReference: "21/2732/000002J",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-10-08",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "OF61018",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 3
              }
            }
          ],
          offenceId: "a7168b59-0693-40c8-ae88-ea54255f6198"
        }
      ]
    },
    count: 1
  })
]
