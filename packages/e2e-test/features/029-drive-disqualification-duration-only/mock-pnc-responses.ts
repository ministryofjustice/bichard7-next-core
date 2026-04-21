import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000304RENQASIPNCA05A73000017300000120210901124773000001                                             050002286</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/5Z      DUFFY                   </IDS>
        <CCR>K21/2732/5M                    </CCR>
        <COF>K001    12:15:16:1   RT88007 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000304R</GMT>
    </CXE01>`,
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
      remandResult: "B",
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
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000305RENQASIPNCA05A73000017300000120210901124773000001                                             050002289</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/5Z      DUFFY                   </IDS>
        <CCR>K21/2732/5M                    </CCR>
        <COF>K001    12:15:16:1   RT88007 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I3096                                                                                                    </DIS>
        <DIS>I4047    26102011                                                                                        </DIS>
      </ASI>
      <GMT>000011073ENQR000305R</GMT>
    </CXE01>`,
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
