import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000316RENQASIPNCA05A73000017300000120210901125773000001                                             050002311</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/11F     SENDNEW                 </IDS>
        <CCR>K21/2812/1E                    </CCR>
        <COF>K001    5:5:5:1      TH68006 01092010                </COF>
        <COF>K002    5:7:11:10    TH68151 01092010                </COF>
        <COF>K003    5:5:8:1      TH68010 01092010                </COF>
      </ASI>
      <GMT>000010073ENQR000316R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "SENDNEW",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/11F",
      courtCaseReference: "21/2812/000001E",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2010-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ONECCR"],
        defendantLastName: "SENDNEW"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
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
          offenceId: "f9e1d78c-c68f-4df9-ad74-7884d8a5e684"
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
          offenceId: "7cdd6d44-0dc0-4872-a575-52fe313b8fc6"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "TH68010",
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
          offenceId: "d08d7883-e9cc-4375-8062-3de1b9555200"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "SENDNEW",
      croNumber: "",
      arrestSummonsNumber: "11/01VK/01/376518T",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/11F",
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
      <GMH>073ENQR000317RENQASIPNCA05A73000017300000120210901125773000001                                             050002314</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/11F     SENDNEW                 </IDS>
        <CCR>K21/2812/1E                    </CCR>
        <COF>K001    5:5:5:1      TH68006 01092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ>
        <DIS>I4011    26102010                                                                                        </DIS>
        <COF>K002    5:7:11:10    TH68151 01092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ>
        <DIS>I4011    26102010                                                                                        </DIS>
        <COF>K003    5:5:8:1      TH68010 01092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ>
        <DIS>I4011    26102010                                                                                        </DIS>
      </ASI>
      <GMT>000016073ENQR000317R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  })
]
