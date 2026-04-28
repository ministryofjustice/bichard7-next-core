import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000491RENQASIPNCA05A73000017300000120210908114273000001                                             050002399</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/29N     TOSINGLECCR             </IDS>
        <CCR>K13/2732/3W                    </CCR>
        <COF>K001    5:5:8:1      TH68010 25092011                </COF>
        <CCR>K13/2732/4X                    </CCR>
        <COF>K001    1:8:11:1     CJ88001 25092011                </COF>
      </ASI>
      <GMT>000010073ENQR000491R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000492RENQASIPNCA05A73000017300000120210908114373000001                                             050002400</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/4Y      TOSINGLECCR             </IDS>
        <CCR>K21/2732/4L                    </CCR>
        <COF>K001    5:5:8:1      TH68010 25092011                </COF>
        <COF>K002    1:8:11:1     CJ88001 25092011                </COF>
      </ASI>
      <GMT>000009073ENQR000492R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "TOSINGLECCR",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/4Y",
      courtCaseReference: "21/2732/000004L",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-11-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MULTIPLECCR"],
        defendantLastName: "TOSINGLECCRX"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-11-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 3025,
              disposalDuration: {
                units: "life",
                count: 0
              },
              disposalText: "SEA MONKEY"
            }
          ],
          offenceId: "f1f981ad-1d56-4007-b2c9-9653772c2be3"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "CJ88001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-11-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 14
              }
            },
            {
              disposalCode: 3107
            }
          ],
          offenceId: "4c639fe7-2b42-499f-863b-3ac3a93670a6"
        }
      ]
    }
  })
]
