import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000728RENQASIPNCA05A73000017300000120210903102773000001                                             050002951</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/23U     TWICEBREACHE            </IDS>
        <CCR>K21/2732/17A                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102009                </COF>
      </ASI>
      <GMT>000008073ENQR000728R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "TWICEBREACHE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/23U",
      courtCaseReference: "21/2732/000017A",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ASNREUSED"],
        defendantLastName: "TWICEBREACHED"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ03510",
          plea: "No Plea Taken",
          adjudication: "Not Guilty",
          dateOfSentence: "2009-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2006
            }
          ],
          offenceId: "6e7dd434-450d-435e-b163-14f13e0830fe"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000729RENQASIPNCA05A73000017300000120210903102773000001                                             050002953</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/23U     TWICEBREACHE            </IDS>
        <CCR>K21/2732/17A                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102009                </COF>
        <ADJ>INO PLEA TAKENNOT GUILTY    261020090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
      </ASI>
      <GMT>000010073ENQR000729R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 2
  })
]
