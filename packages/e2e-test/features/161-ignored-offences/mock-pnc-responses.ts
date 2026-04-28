import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000706RENQASIPNCA05A73000017300000120210903102273000001                                             050002904</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/13H     JUDGE                   </IDS>
        <CCR>K21/2732/9R                    </CCR>
        <COF>K001                 RR84042 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000706R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "JUDGE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/13H",
      courtCaseReference: "21/2732/000009R",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["FRANKLIN"],
        defendantLastName: "JUDGE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RR84042",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "da71060c-cfb2-4048-8f67-81f714efd655"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000707RENQASIPNCA05A73000017300000120210903102273000001                                             050002906</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/13H     JUDGE                   </IDS>
        <CCR>K21/2732/9R                    </CCR>
        <COF>K001                 RR84042 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I1002M12                                                                                                 </DIS>
      </ASI>
      <GMT>000010073ENQR000707R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  })
]
