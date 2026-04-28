import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000302RENQASIPNCA05A73000017300000120210901124473000001                                             050002281</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/4Y      JIMBOBJONES             </IDS>
        <CCR>K21/2732/4L                    </CCR>
        <COF>K001    12:15:16:1   RT88007 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000302R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "JIMBOBJONES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/4Y",
      courtCaseReference: "21/2732/000004L",
      court: {
        courtIdentityType: "code",
        courtCode: "1910"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BOBBY"],
        defendantLastName: "JIMBOBJONES"
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
          offenceId: "bdc8d0bb-7d31-4195-8639-d1fac76115c4"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "JIMBOBJONES",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/448696W",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/4Y",
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
      <GMH>073ENQR000303RENQASIPNCA05A73000017300000120210901124573000001                                             050002284</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/4Y      JIMBOBJONES             </IDS>
        <CCR>K21/2732/4L                    </CCR>
        <COF>K001    12:15:16:1   RT88007 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I3096                                                                                                    </DIS>
        <DIS>I4047    26102011                                                                                        </DIS>
      </ASI>
      <GMT>000011073ENQR000303R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "JIMBOBJONES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/4Y",
      courtCaseReference: "21/2732/000004L",
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
              disposalCode: 3070,
              disposalDuration: {
                units: "months",
                count: 12
              },
              disposalText: "FROM 26/09/11"
            }
          ],
          offenceId: "18267c83-7397-4f6a-9a03-78dd24590686"
        }
      ]
    },
    count: 1
  })
]
