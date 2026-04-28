import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000320RENQASIPNCA05A73000017300000120210901130373000001                                             050002317</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/13H     DDDRAVEN                </IDS>
        <CCR>K21/2732/10T                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
        <COF>K002    8:7:69:3     CJ03510 01102010                </COF>
      </ASI>
      <GMT>000009073ENQR000320R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "DDDRAVEN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/13H",
      courtCaseReference: "21/2732/000010T",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-21",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ALEX"],
        defendantLastName: "DDDRAVEN"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ03510",
          plea: "No Plea Taken",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-21",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2011-10-28"
            }
          ],
          offenceId: "39e6fb23-2d2b-4314-a9ab-5a4ffc9c74fa"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "CJ03510",
          plea: "No Plea Taken",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-21",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2011-10-28"
            }
          ],
          offenceId: "86512839-11d7-4077-83c5-b7524a1172bc"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "DDDRAVEN",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410821D",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/13H",
      remandDate: "2011-10-21",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-28",
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
      <GMH>073ENQR000321RENQASIPNCA05A73000017300000120210901130373000001                                             050002320</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/13H     DDDRAVEN                </IDS>
        <CCR>K21/2732/10T                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
        <ADJ>INO PLEA TAKENGUILTY        211020110000 </ADJ>
        <DIS>I4011    28102011                                                                                        </DIS>
        <COF>K002    8:7:69:3     CJ03510 01102010                </COF>
        <ADJ>INO PLEA TAKENGUILTY        211020110000 </ADJ>
        <DIS>I4011    28102011                                                                                        </DIS>
      </ASI>
      <GMT>000013073ENQR000321R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: ""
  })
]
