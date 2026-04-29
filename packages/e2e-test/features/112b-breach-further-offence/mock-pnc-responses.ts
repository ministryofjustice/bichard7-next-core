import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000698RENQASIPNCA05A73000017300000120210903102173000001                                             050002885</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/29A     SUSSENTENCE             </IDS>
        <CCR>K21/2732/23G                   </CCR>
        <COF>K001    5:5:8:1      TH68010 01102010                </COF>
      </ASI>
      <GMT>000008073ENQR000698R</GMT>
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
      personUrn: "21/29A",
      courtCaseReference: "21/2732/000023G",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BREACH"],
        defendantLastName: "SUSSENTENCETWO"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 3
              }
            }
          ],
          offenceId: "b4bc868e-684a-4fe6-8352-c3bbdabc9cc5"
        }
      ]
    },
    count: 1
  })
]
