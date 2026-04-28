import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000731RENQASIPNCA05A73000017300000120210903102873000001                                             050002955</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/24V     THREEZEROFIV            </IDS>
        <CCR>K21/2732/18B                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000731R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "THREEZEROFIV",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
      courtCaseReference: "21/2732/000018B",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ADJPOSTJUDGE"],
        defendantLastName: "THREEZEROFIVETWO"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4004,
              disposalEffectiveDate: "2011-10-08"
            }
          ],
          offenceId: "9b70ef35-d6c2-4c06-a22c-7f9d044287ed"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "THREEZEROFIV",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/500009X",
      crimeOffenceReferenceNo: "",
      remandResult: "C",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-in-custody",
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
      <GMH>073ENQR000732RENQASIPNCA05A73000017300000120210903102873000001                                             050002958</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/24V     THREEZEROFIV            </IDS>
        <CCR>K21/2732/18B                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4004    08102011                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000732R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  })
]
