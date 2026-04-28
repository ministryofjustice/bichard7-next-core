import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000724RENQASIPNCA05A73000017300000120210903102673000001                                             050002942</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/26X     POSTADJUDICA            </IDS>
        <CCR>K21/2732/20D                   </CCR>
        <COF>K001    5:7:11:10    TH68151 28112006                </COF>
      </ASI>
      <GMT>000008073ENQR000724R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "POSTADJUDICA",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/26X",
      courtCaseReference: "21/2732/000020D",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["PASSAWAY"],
        defendantLastName: "POSTADJUDICATION"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4047,
              disposalEffectiveDate: "2011-10-26"
            }
          ],
          offenceId: "6bcc95de-ac46-4f5c-9d92-aaa8268ea0cd"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "POSTADJUDICA",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/448750E",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/26X",
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
      <GMH>073ENQR000725RENQASIPNCA05A73000017300000120210903102673000001                                             050002945</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/26X     POSTADJUDICA            </IDS>
        <CCR>K21/2732/20D                   </CCR>
        <COF>K001    5:7:11:10    TH68151 28112006                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4047    26102011                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000725R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "POSTADJUDICA",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/26X",
      courtCaseReference: "21/2732/000020D",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-10-26",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68151",
          disposalResults: [
            {
              disposalCode: 2065
            }
          ],
          offenceId: "fc7707c6-ac0d-4a2c-a26d-c8edafa71df0"
        }
      ]
    },
    count: 1
  })
]
