import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000330RENQASIPNCA05A73000017300000120210901131673000001                                             050002340</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/20Q     SENDEF                  </IDS>
        <CCR>K21/2732/15Y                   </CCR>
        <COF>K001    5:5:5:1      TH68006 01102011                </COF>
      </ASI>
      <GMT>000008073ENQR000330R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "SENDEF",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/20Q",
      courtCaseReference: "21/2732/000015Y",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["TICS"],
        defendantLastName: "SENDEF"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4047,
              disposalEffectiveDate: "2011-10-30"
            }
          ],
          offenceId: "c7762083-e4a0-4006-8abb-bc80b3eeb571"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "SENDEF",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/440811B",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/20Q",
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
        date: "2011-10-30",
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
      <GMH>073ENQR000331RENQASIPNCA05A73000017300000120210901131673000001                                             050002343</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/20Q     SENDEF                  </IDS>
        <CCR>K21/2732/15Y                   </CCR>
        <COF>K001    5:5:5:1      TH68006 01102011                </COF>
        <ADJ>IGUILTY       GUILTY        261020110000 </ADJ>
        <DIS>I4047    30102011                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000331R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "SENDEF",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/20Q",
      courtCaseReference: "21/2732/000015Y",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-10-30",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          disposalResults: [
            {
              disposalCode: 1116,
              disposalEffectiveDate: "2013-05-17"
            }
          ],
          offenceId: "a776ec27-c3b9-467c-884c-ae21e43d4036"
        }
      ]
    },
    count: 1
  })
]
