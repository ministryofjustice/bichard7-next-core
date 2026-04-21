import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000697RENQASIPNCA05A73000017300000120210903102173000001                                             050002883</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/28Z     SUSSENTENCE             </IDS>
        <CCR>K21/2732/22F                   </CCR>
        <COF>K001    1:8:11:2     CJ88116 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000697R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "SUSSENTENCE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/28Z",
      courtCaseReference: "21/2732/000022F",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BREACH"],
        defendantLastName: "SUSSENTENCE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ88116",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1115,
              disposalDuration: {
                units: "months",
                count: 4
              },
              disposalQualifiers: ["S"],
              disposalQualifierDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "997ff8ae-bbe7-471e-8c69-8eda0eec767d"
        }
      ]
    },
    count: 1
  })
]
